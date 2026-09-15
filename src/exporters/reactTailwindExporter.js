import { decompileFormula } from '../formulas/formulaTranspiler.js'

function styleToTailwind(style = {}) {
  const classes = []

  if (style.display === 'flex') classes.push('flex')
  if (style.display === 'inline-flex') classes.push('inline-flex')
  if (style.display === 'grid') classes.push('grid')
  if (style.display === 'none') classes.push('hidden')

  if (style['flex-direction'] === 'column') classes.push('flex-col')
  if (style['flex-direction'] === 'row') classes.push('flex-row')

  if (style['align-items'] === 'center') classes.push('items-center')
  if (style['align-items'] === 'flex-start') classes.push('items-start')
  if (style['align-items'] === 'flex-end') classes.push('items-end')

  if (style['justify-content'] === 'center') classes.push('justify-center')
  if (style['justify-content'] === 'space-between') classes.push('justify-between')
  if (style['justify-content'] === 'flex-start') classes.push('justify-start')

  if (style['font-weight'] === '700' || style['font-weight'] === 'bold') classes.push('font-bold')
  if (style['font-weight'] === '600') classes.push('font-semibold')
  if (style['font-weight'] === '500') classes.push('font-medium')

  if (style.cursor === 'pointer') classes.push('cursor-pointer')

  return classes.join(' ')
}

export function exportToReactTailwind(component) {
  const name = component.name || 'GeneratedComponent'
  const nodes = component.nodes || {}
  const variables = component.variables || {}
  const attributes = component.attributes || {}

  const stateHooks = []
  for (const [varName, varDef] of Object.entries(variables)) {
    const val = JSON.stringify(varDef.initialValue?.value ?? '')
    const capitalized = varName.charAt(0).toUpperCase() + varName.slice(1)
    stateHooks.push(`  const [${varName}, set${capitalized}] = useState(${val});`)
  }

  const propTypes = []
  for (const [attrName] of Object.entries(attributes)) {
    propTypes.push(`  ${attrName}?: string;`)
  }

  function renderNode(nodeId, depth = 2) {
    const indent = '  '.repeat(depth)
    const node = nodes[nodeId]
    if (!node) return ''

    if (node.type === 'text') {
      const expr = decompileFormula(node.value)
      if (expr.startsWith('"') && expr.endsWith('"')) {
        return `${indent}${expr.slice(1, -1)}`
      }
      return `${indent}{${expr.replace(/Variables\./g, '').replace(/Attributes\./g, '')}}`
    }

    if (node.type === 'slot') {
      return `${indent}{children}`
    }

    const tag = node.tag || 'div'
    const twClasses = styleToTailwind(node.style)
    const styleAttr = node.style && Object.keys(node.style).length > 0
      ? ` style={${JSON.stringify(node.style)}}`
      : ''
    const classAttr = twClasses ? ` className="${twClasses}"` : ''

    const children = (node.children || [])
      .map((cid) => renderNode(cid, depth + 1))
      .filter(Boolean)

    if (children.length === 0) {
      return `${indent}<${tag}${classAttr}${styleAttr} />`
    }

    return `${indent}<${tag}${classAttr}${styleAttr}>\n${children.join('\n')}\n${indent}</${tag}>`
  }

  const renderedRoot = nodes.root ? renderNode('root') : '  <div>Empty</div>'

  return `import React, { useState } from 'react';

${propTypes.length > 0 ? `export interface ${name}Props {\n${propTypes.join('\n')}\n}\n` : ''}
export const ${name}: React.FC<${propTypes.length > 0 ? `${name}Props & { children?: React.ReactNode }` : '{ children?: React.ReactNode }'}> = (${propTypes.length > 0 ? 'props' : '{ children }'}) => {
${stateHooks.length > 0 ? `${stateHooks.join('\n')}\n` : ''}
  return (
${renderedRoot}
  );
};

export default ${name};
`
}
