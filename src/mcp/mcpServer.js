import readline from 'node:readline'
import { expandCompactComponent } from '../dsl/compiler.js'
import { exportToFramework } from '../exporters/index.js'
import { exportToTokensStudio, importFromTokensStudio } from '../figma/figmaSync.js'
import { autoHealComponent } from '../healer/autoFixer.js'
import { ASTMutator } from '../orchestrator/astMutator.js'
import { ValidatorGate } from '../orchestrator/validatorGate.js'
import {
  createAccordionPrimitive,
  createButtonPrimitive,
  createCardPrimitive,
  createComboboxPrimitive,
  createDialogPrimitive,
  createDropdownPrimitive,
  createInputPrimitive,
  createTabsPrimitive,
  createToastPrimitive,
} from '../primitives/index.js'
import { generateDesignSystemTheme } from '../tokens/tokenEngine.js'

export const MCP_TOOLS = [
  {
    name: 'producer_generate_theme',
    description: 'Generates an accessible, WCAG AA-compliant design system theme with 10-step tonal palettes.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the theme' },
        primarySeed: { type: 'string', description: 'Primary brand hex color (e.g. #3B82F6)' },
        neutralSeed: { type: 'string', description: 'Neutral gray/slate hex color' },
        scheme: { type: 'string', enum: ['dark', 'light'], description: 'Color scheme mode' },
      },
      required: ['name', 'primarySeed'],
    },
  },
  {
    name: 'producer_generate_component',
    description: 'Expands a high-density Compact Component specification into a full, standards-compliant Component AST.',
    inputSchema: {
      type: 'object',
      properties: {
        compactSpec: { type: 'object', description: 'Compact component object adhering to Producer Cue DSL' },
      },
      required: ['compactSpec'],
    },
  },
  {
    name: 'producer_mutate_component',
    description: 'Applies surgical mutations (style, text, variants, children) to an existing component without full regeneration.',
    inputSchema: {
      type: 'object',
      properties: {
        component: { type: 'object', description: 'The component AST to patch' },
        mutations: {
          type: 'array',
          description: 'Array of mutations (SetNodeStyle, SetNodeText, AddVariant, InsertChild, RemoveNode)',
        },
      },
      required: ['component', 'mutations'],
    },
  },
  {
    name: 'producer_audit_and_heal',
    description: 'Audits a component for accessibility and structural issues, and automatically self-heals any contrast or ARIA failures.',
    inputSchema: {
      type: 'object',
      properties: {
        component: { type: 'object', description: 'The component AST to audit and heal' },
      },
      required: ['component'],
    },
  },
  {
    name: 'producer_export_code',
    description: 'Exports a component to idiomatic React + Tailwind, Svelte 5 (Runes), Vue 3, or standalone Custom Web Element.',
    inputSchema: {
      type: 'object',
      properties: {
        component: { type: 'object', description: 'The component AST' },
        target: { type: 'string', enum: ['react', 'svelte', 'vue', 'web-component'], description: 'Export framework' },
      },
      required: ['component', 'target'],
    },
  },
  {
    name: 'producer_get_primitive',
    description: 'Retrieves a production-ready, accessible headless UI primitive (button, card, dialog, tabs, accordion, toast, combobox).',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['button', 'card', 'dialog', 'input', 'tabs', 'dropdown', 'accordion', 'toast', 'combobox'],
          description: 'Type of primitive to retrieve',
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'producer_figma_sync',
    description: 'Imports or exports Tokens Studio / Figma design token trees.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['import', 'export'], description: 'Import or export action' },
        tokens: { type: 'object', description: 'Tokens Studio JSON or Theme object' },
      },
      required: ['action', 'tokens'],
    },
  },
]

export function handleMcpToolCall(name, args) {
  switch (name) {
    case 'producer_generate_theme':
      return generateDesignSystemTheme({
        name: args.name,
        primarySeed: args.primarySeed,
        neutralSeed: args.neutralSeed,
        scheme: args.scheme,
      })

    case 'producer_generate_component':
      return expandCompactComponent(args.compactSpec)

    case 'producer_mutate_component':
      return ASTMutator.applyMutations(args.component, args.mutations)

    case 'producer_audit_and_heal': {
      const initialAudit = ValidatorGate.validate(args.component)
      const healedResult = autoHealComponent(args.component)
      const postAudit = ValidatorGate.validate(healedResult.healedComponent)
      return {
        initialScore: initialAudit.score,
        postHealingScore: postAudit.score,
        fixesApplied: healedResult.fixesApplied,
        component: healedResult.healedComponent,
      }
    }

    case 'producer_export_code':
      return {
        target: args.target,
        code: exportToFramework(args.component, args.target),
      }

    case 'producer_get_primitive': {
      switch (args.type) {
        case 'button':
          return createButtonPrimitive()
        case 'dialog':
          return createDialogPrimitive()
        case 'input':
          return createInputPrimitive()
        case 'tabs':
          return createTabsPrimitive()
        case 'dropdown':
          return createDropdownPrimitive()
        case 'accordion':
          return createAccordionPrimitive()
        case 'toast':
          return createToastPrimitive()
        case 'combobox':
          return createComboboxPrimitive()
        default:
          return createCardPrimitive()
      }
    }

    case 'producer_figma_sync':
      if (args.action === 'import') {
        return importFromTokensStudio(args.tokens)
      } else {
        return exportToTokensStudio(args.tokens)
      }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

export function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  rl.on('line', (line) => {
    if (!line.trim()) return

    try {
      const request = JSON.parse(line)
      const { id, method, params } = request

      if (method === 'initialize') {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'producer-cue',
              version: '1.0.0',
            },
          },
        }
        process.stdout.write(`${JSON.stringify(response)}\n`)
        return
      }

      if (method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS,
          },
        }
        process.stdout.write(`${JSON.stringify(response)}\n`)
        return
      }

      if (method === 'tools/call') {
        const toolName = params.name
        const toolArgs = params.arguments || {}
        const result = handleMcpToolCall(toolName, toolArgs)

        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
        }
        process.stdout.write(`${JSON.stringify(response)}\n`)
        return
      }

      if (id !== undefined) {
        process.stdout.write(
          `${JSON.stringify({ jsonrpc: '2.0', id, result: {} })}\n`,
        )
      }
    } catch (err) {
      process.stderr.write(`Producer Cue MCP Server Error: ${err.message}\n`)
    }
  })
}
