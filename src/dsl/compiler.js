import { compileExpression, decompileFormula } from '../formulas/formulaTranspiler.js'

export function expandCompactComponent(compact, options = {}) {
  const variableNames = Object.keys(compact.variables || {})
  const attributeNames = Object.keys(compact.attributes || {})
  const formulaContext = { variables: variableNames, attributes: attributeNames }

  const nodes = {}
  let nodeCounter = 0

  function generateId(prefix = 'node') {
    nodeCounter++
    if (options.deterministicIds) {
      return `${prefix}_${nodeCounter}`
    }
    return `${prefix}_${Math.random().toString(36).substring(2, 9)}`
  }

  function processNode(compactNode, explicitId) {
    const nodeId = explicitId || compactNode.id || generateId(compactNode.tag || 'node')

    if (compactNode.tag.startsWith('component:')) {
      const componentName = compactNode.tag.replace('component:', '')
      const attrs = {}
      if (compactNode.attrs) {
        for (const [k, v] of Object.entries(compactNode.attrs)) {
          attrs[k] = typeof v === 'string' && (v.includes('+') || v.includes('.') || v.includes('('))
            ? compileExpression(v, formulaContext)
            : { type: 'value', value: v }
        }
      }

      nodes[nodeId] = {
        type: 'component',
        name: componentName,
        style: compactNode.style || {},
        attrs,
        children: [],
        events: {},
      }
      return nodeId
    }

    if (compactNode.tag === 'slot') {
      nodes[nodeId] = {
        type: 'slot',
        name: compactNode.slot || 'default',
        children: [],
      }
      return nodeId
    }

    const childIds = []

    if (compactNode.text !== undefined && compactNode.text !== null) {
      const textId = generateId('text')
      const textFormula =
        typeof compactNode.text === 'string' &&
        (compactNode.text.includes('+') ||
          compactNode.text.includes('.') ||
          compactNode.text.includes('(') ||
          compactNode.text.includes('?'))
          ? compileExpression(compactNode.text, formulaContext)
          : { type: 'value', value: compactNode.text }

      nodes[textId] = {
        type: 'text',
        value: textFormula,
      }
      childIds.push(textId)
    }

    if (compactNode.children && Array.isArray(compactNode.children)) {
      for (const child of compactNode.children) {
        if (typeof child === 'string') {
          const textId = generateId('text')
          const textFormula =
            child.includes('+') || child.includes('.') || child.includes('(') || child.includes('?')
              ? compileExpression(child, formulaContext)
              : { type: 'value', value: child }

          nodes[textId] = {
            type: 'text',
            value: textFormula,
          }
          childIds.push(textId)
        } else if (typeof child === 'object' && child !== null) {
          const childId = processNode(child)
          childIds.push(childId)
        }
      }
    }

    const attrs = {}
    if (compactNode.attrs) {
      for (const [key, val] of Object.entries(compactNode.attrs)) {
        if (typeof val === 'string' && (val.includes('+') || val.includes('.') || val.includes('('))) {
          attrs[key] = compileExpression(val, formulaContext)
        } else {
          attrs[key] = { type: 'value', value: val }
        }
      }
    }

    const events = {}
    if (compactNode.events) {
      for (const [eventTrigger, actionSpec] of Object.entries(compactNode.events)) {
        const actionList = Array.isArray(actionSpec) ? actionSpec : [actionSpec]
        events[eventTrigger] = {
          trigger: eventTrigger,
          actions: actionList.map((act) => {
            if (act.type === 'SetVariable' && act.variable) {
              return {
                type: 'SetVariable',
                variable: act.variable,
                data:
                  typeof act.data === 'string'
                    ? compileExpression(act.data, formulaContext)
                    : { type: 'value', value: act.data },
              }
            }
            if (act.type === 'TriggerEvent' && act.event) {
              return {
                type: 'TriggerEvent',
                event: act.event,
                data:
                  typeof act.data === 'string'
                    ? compileExpression(act.data, formulaContext)
                    : { type: 'value', value: act.data },
              }
            }
            return act
          }),
        }
      }
    }

    const variants = (compactNode.variants || []).map((v) => ({
      hover: v.hover ?? false,
      active: v.active ?? false,
      focus: v.focus ?? false,
      style: v.style || {},
    }))

    const elementNode = {
      type: 'element',
      tag: compactNode.tag || 'div',
      style: compactNode.style || {},
      attrs,
      events,
      classes: {},
      children: childIds,
    }

    if (variants.length > 0) {
      elementNode.variants = variants
    }

    if (compactNode.condition) {
      elementNode.condition = compileExpression(compactNode.condition, formulaContext)
    }

    if (compactNode.repeat) {
      elementNode.repeat = compileExpression(compactNode.repeat, formulaContext)
    }

    if (compactNode.repeatKey) {
      elementNode.repeatKey = compileExpression(compactNode.repeatKey, formulaContext)
    }

    nodes[nodeId] = elementNode
    return nodeId
  }

  processNode(compact.root, 'root')

  const variables = {}
  if (compact.variables) {
    for (const [varName, varDef] of Object.entries(compact.variables)) {
      const initialVal = varDef.initialValue !== undefined ? varDef.initialValue : varDef
      variables[varName] = {
        name: varName,
        initialValue: {
          type: 'value',
          value: initialVal,
        },
      }
    }
  }

  const attributes = {}
  if (compact.attributes) {
    for (const [attrName, attrDef] of Object.entries(compact.attributes)) {
      attributes[attrName] = {
        name: attrName,
        testValue: attrDef.testValue ?? attrDef.default ?? '',
      }
    }
  }

  return {
    name: compact.name,
    attributes,
    variables,
    formulas: {},
    workflows: {},
    apis: {},
    events: [],
    nodes,
  }
}

export function compressToCompactComponent(component) {
  const nodes = component.nodes || {}
  const rootNode = nodes.root || Object.values(nodes)[0]

  if (!rootNode) {
    return {
      name: component.name || 'Component',
      root: { tag: 'div' },
    }
  }

  const visited = new Set()

  function deconstructNode(nodeId) {
    if (visited.has(nodeId)) {
      return `[Circular: ${nodeId}]`
    }
    visited.add(nodeId)

    const node = nodes[nodeId]
    if (!node) return ''

    if (node.type === 'text') {
      return decompileFormula(node.value)
    }

    if (node.type === 'slot') {
      return { tag: 'slot', slot: node.name || 'default' }
    }

    if (node.type === 'component') {
      const compNode = {
        tag: `component:${node.name}`,
        style: Object.keys(node.style || {}).length > 0 ? node.style : undefined,
      }
      return compNode
    }

    const compact = {
      tag: node.tag || 'div',
    }

    if (node.style && Object.keys(node.style).length > 0) {
      compact.style = node.style
    }

    const children = node.children || []
    if (children.length === 1 && nodes[children[0]]?.type === 'text') {
      compact.text = decompileFormula(nodes[children[0]].value)
    } else if (children.length > 0) {
      compact.children = children.map((cid) => deconstructNode(cid))
    }

    if (node.variants && node.variants.length > 0) {
      compact.variants = node.variants.map((v) => ({
        hover: v.hover,
        active: v.active,
        focus: v.focus,
        style: v.style,
      }))
    }

    if (node.condition) {
      compact.condition = decompileFormula(node.condition)
    }

    if (node.events && Object.keys(node.events).length > 0) {
      compact.events = {}
      for (const [trigger, evt] of Object.entries(node.events)) {
        if (evt?.actions) {
          compact.events[trigger] = evt.actions.map((act) => ({
            type: act.type,
            variable: act.variable,
            event: act.event,
            data: act.data ? decompileFormula(act.data) : undefined,
          }))
        }
      }
    }

    return compact
  }

  const rootCompact = deconstructNode('root')

  return {
    name: component.name,
    variables: component.variables
      ? Object.fromEntries(
          Object.entries(component.variables).map(([k, v]) => [
            k,
            { initialValue: v.initialValue?.value },
          ]),
        )
      : undefined,
    attributes: component.attributes
      ? Object.fromEntries(
          Object.entries(component.attributes).map(([k, v]) => [
            k,
            { testValue: v.testValue },
          ]),
        )
      : undefined,
    root: typeof rootCompact === 'string' ? { tag: 'div', text: rootCompact } : rootCompact,
  }
}
