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
import {
  createProject,
  createComponent,
  addNode,
  addVariable,
  addApi,
} from '../nordcraft/projectBuilder.js'
import { renderNordcraftSsr } from '../nordcraft/ssrRenderer.js'

export const MCP_TOOLS = [
  // ── Authentic Nordcraft Engine Tools ─────────────────────────────────────
  {
    name: 'nordcraft_create_project',
    description: 'Scaffolds an official Nordcraft Project AST conforming to @nordcraft/core specifications.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Application name' },
        description: { type: 'string', description: 'Application description' },
        shortId: { type: 'string', description: 'Short identifier' },
        emoji: { type: 'string', description: 'Project icon emoji' },
      },
    },
  },
  {
    name: 'nordcraft_add_component',
    description: 'Adds an official Nordcraft Component or Page to a project AST.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
        name: { type: 'string', description: 'Component name (e.g. HomePage, Sidebar)' },
        isPage: { type: 'boolean', description: 'Whether this component is a route page' },
        title: { type: 'string', description: 'Page title' },
        description: { type: 'string', description: 'Page description' },
        path: { type: 'array', description: 'Route path segments' },
      },
      required: ['project', 'name'],
    },
  },
  {
    name: 'nordcraft_add_node',
    description: 'Inserts an Element or Text node into a Nordcraft Component node tree.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
        componentName: { type: 'string', description: 'Target component name' },
        id: { type: 'string', description: 'Optional unique node ID' },
        parentId: { type: 'string', description: 'Parent node ID (defaults to root)' },
        tag: { type: 'string', description: 'HTML tag (div, h1, button, p, nav, etc.)' },
        type: { type: 'string', enum: ['element', 'text'], description: 'Node type' },
        style: { type: 'object', description: 'CSS styles map' },
        attrs: { type: 'object', description: 'HTML attributes map' },
        text: { type: 'string', description: 'Text content (for text nodes)' },
        children: { type: 'array', description: 'Child node IDs' },
      },
      required: ['project', 'componentName'],
    },
  },
  {
    name: 'nordcraft_add_variable',
    description: 'Adds a reactive signal / local state variable to a Nordcraft component.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
        componentName: { type: 'string', description: 'Target component name' },
        name: { type: 'string', description: 'Variable name' },
        initialValue: { description: 'Initial variable value' },
      },
      required: ['project', 'componentName', 'name', 'initialValue'],
    },
  },
  {
    name: 'nordcraft_add_api',
    description: 'Binds a REST API (e.g. NoCodeBackend) to a Nordcraft component.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
        componentName: { type: 'string', description: 'Target component name' },
        name: { type: 'string', description: 'API endpoint name' },
        url: { type: 'string', description: 'Target URL' },
        method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'], description: 'HTTP method' },
        headers: { type: 'object', description: 'HTTP headers map' },
        autoFetch: { type: 'boolean', description: 'Whether to auto-fetch on mount' },
      },
      required: ['project', 'componentName', 'name', 'url'],
    },
  },
  {
    name: 'nordcraft_render_ssr',
    description: 'Renders a Nordcraft component to production-ready SSR HTML and CSS using @nordcraft/ssr.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
        componentName: { type: 'string', description: 'Component name to render' },
        url: { type: 'string', description: 'Target request URL' },
      },
      required: ['project'],
    },
  },
  {
    name: 'nordcraft_export_project',
    description: 'Serializes the entire Nordcraft project AST to formatted JSON.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Nordcraft project AST' },
      },
      required: ['project'],
    },
  },

  // ── High-Level UI & Design System Tools ──────────────────────────────────
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

export async function handleMcpToolCall(name, args) {
  switch (name) {
    // ── Nordcraft Engine Handlers ──────────────────────────────────────────
    case 'nordcraft_create_project':
      return createProject({
        name: args.name,
        description: args.description,
        shortId: args.shortId,
        emoji: args.emoji,
      })

    case 'nordcraft_add_component': {
      const { project, name: compName, isPage, title, description, path } = args
      const component = createComponent({
        name: compName,
        isPage: isPage !== false,
        title,
        description,
        path: path || [],
      })
      project.files.components[compName] = component
      return { success: true, componentName: compName, project }
    }

    case 'nordcraft_add_node': {
      const { project, componentName, id, parentId, tag, type, style, attrs, text, children } = args
      const component = project.files.components[componentName]
      if (!component) {
        throw new Error(`Component "${componentName}" not found in project`)
      }
      const nodeId = addNode(component, {
        id,
        parentId: parentId || 'root',
        tag: tag || 'div',
        type: type || 'element',
        style: style || {},
        attrs: attrs || {},
        text,
        children: children || [],
      })
      return { success: true, nodeId, componentName, project }
    }

    case 'nordcraft_add_variable': {
      const { project, componentName, name: varName, initialValue } = args
      const component = project.files.components[componentName]
      if (!component) {
        throw new Error(`Component "${componentName}" not found in project`)
      }
      addVariable(component, varName, initialValue)
      return { success: true, variable: varName, project }
    }

    case 'nordcraft_add_api': {
      const { project, componentName, name: apiName, url, method, headers, autoFetch } = args
      const component = project.files.components[componentName]
      if (!component) {
        throw new Error(`Component "${componentName}" not found in project`)
      }
      addApi(component, apiName, { url, method, headers, autoFetch })
      return { success: true, api: apiName, project }
    }

    case 'nordcraft_render_ssr': {
      const { project, componentName = 'HomePage', url = 'http://localhost:3000/' } = args
      return await renderNordcraftSsr(project, componentName, url)
    }

    case 'nordcraft_export_project': {
      return {
        project: args.project,
        json: JSON.stringify(args.project, null, 2),
      }
    }

    // ── Design System & UI Handlers ────────────────────────────────────────
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

export async function startStdioServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  for await (const line of rl) {
    if (!line.trim()) continue
    try {
      const request = JSON.parse(line)
      const response = await executeRpc(request)
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n')
      }
    } catch (err) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: `Parse error: ${err.message}` },
        }) + '\n'
      )
    }
  }
}

export const startMcpServer = startStdioServer

export async function executeRpc(request) {
  const { jsonrpc, id, method, params } = request

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: id ?? null,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
        serverInfo: {
          name: 'producer-cue',
          version: '2.0.0',
          engine: 'Nordcraft Engine Integration',
        },
      },
    }
  }

  if (method === 'ping') {
    return {
      jsonrpc: '2.0',
      id: id ?? null,
      result: {},
    }
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: id ?? null,
      result: {
        tools: MCP_TOOLS,
      },
    }
  }

  if (method === 'tools/call') {
    const toolName = params?.name
    const toolArgs = params?.arguments || {}
    try {
      const result = await handleMcpToolCall(toolName, toolArgs)
      return {
        jsonrpc: '2.0',
        id: id ?? null,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        },
      }
    } catch (toolErr) {
      return {
        jsonrpc: '2.0',
        id: id ?? null,
        isError: true,
        result: {
          content: [
            {
              type: 'text',
              text: `Tool error: ${toolErr.message}`,
            },
          ],
        },
      }
    }
  }

  if (id !== undefined) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`,
      },
    }
  }

  return null
}
