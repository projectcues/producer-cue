import { decompileFormula } from '../formulas/formulaTranspiler.js'

export function exportToVue(component) {
  const nodes = component.nodes || {}
  const variables = component.variables || {}
  const attributes = component.attributes || {}

  const scriptLines = ['<script setup lang="ts">', "import { ref } from 'vue';"]

  if (Object.keys(attributes).length > 0) {
    const propsShape = Object.keys(attributes)
      .map((k) => `  ${k}?: string;`)
      .join('\n')
    scriptLines.push(`defineProps<{\n${propsShape}\n}>();`)
  }

  for (const [varName, varDef] of Object.entries(variables)) {
    const val = JSON.stringify(varDef.initialValue?.value ?? '')
    scriptLines.push(`const ${varName} = ref(${val});`)
  }
  scriptLines.push('</script>\n')

  function renderNode(nodeId, depth = 1) {
    const indent = '  '.repeat(depth)
    const node = nodes[nodeId]
    if (!node) return ''

    if (node.type === 'text') {
      const expr = decompileFormula(node.value)
      if (expr.startsWith('"') && expr.endsWith('"')) {
        return `${indent}${expr.slice(1, -1)}`
      }
      return `${indent}{{ ${expr.replace(/Variables\./g, '').replace(/Attributes\./g, '')} }}`
    }

    if (node.type === 'slot') {
      return `${indent}<slot />`
    }

    const tag = node.tag || 'div'
    const styleEntries = Object.entries(node.style || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
    const styleAttr = styleEntries ? ` style="${styleEntries}"` : ''

    const children = (node.children || [])
      .map((cid) => renderNode(cid, depth + 1))
      .filter(Boolean)

    if (children.length === 0) {
      return `${indent}<${tag}${styleAttr} />`
    }

    return `${indent}<${tag}${styleAttr}>\n${children.join('\n')}\n${indent}</${tag}>`
  }

  const template = nodes.root ? renderNode('root') : '  <div>Empty</div>'

  return `${scriptLines.join('\n')}\n<template>\n${template}\n</template>\n`
}
