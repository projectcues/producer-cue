import { compileExpression } from '../formulas/formulaTranspiler.js'

export class ASTMutator {
  static applyMutations(component, mutations) {
    const updated = JSON.parse(JSON.stringify(component))

    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'SetNodeStyle':
          this.setNodeStyle(updated, mutation.nodeId, mutation.payload)
          break
        case 'SetNodeText':
          this.setNodeText(updated, mutation.nodeId, mutation.payload)
          break
        case 'AddVariant':
          this.addVariant(updated, mutation.nodeId, mutation.payload)
          break
        case 'InsertChild':
          this.insertChild(updated, mutation.parentId, mutation.payload)
          break
        case 'RemoveNode':
          this.removeNode(updated, mutation.nodeId)
          break
        case 'SetVariable':
          this.setVariable(updated, mutation.payload.name, mutation.payload.initialValue)
          break
      }
    }

    return updated
  }

  static setNodeStyle(component, nodeId, styleUpdates) {
    const node = component.nodes?.[nodeId]
    if (!node) {
      throw new Error(`Node "${nodeId}" not found in component`)
    }
    node.style = {
      ...(node.style || {}),
      ...styleUpdates,
    }
  }

  static setNodeText(component, nodeId, newText) {
    const node = component.nodes?.[nodeId]
    if (!node) {
      throw new Error(`Node "${nodeId}" not found in component`)
    }

    if (node.type === 'text') {
      node.value = compileExpression(newText)
      return
    }

    const children = node.children || []
    for (const cid of children) {
      if (component.nodes[cid]?.type === 'text') {
        component.nodes[cid].value = compileExpression(newText)
        return
      }
    }

    const textId = `text_${Math.random().toString(36).substring(2, 7)}`
    component.nodes[textId] = {
      type: 'text',
      value: compileExpression(newText),
    }
    node.children = [...children, textId]
  }

  static addVariant(component, nodeId, variant) {
    const node = component.nodes?.[nodeId]
    if (!node) {
      throw new Error(`Node "${nodeId}" not found in component`)
    }
    node.variants = [...(node.variants || []), variant]
  }

  static insertChild(component, parentId, childSpec) {
    const parent = component.nodes?.[parentId]
    if (!parent) {
      throw new Error(`Parent node "${parentId}" not found`)
    }

    const childId = `node_${Math.random().toString(36).substring(2, 7)}`
    const childNode = {
      type: 'element',
      tag: childSpec.tag,
      style: childSpec.style || {},
      attrs: {},
      classes: {},
      children: [],
      events: {},
    }

    if (childSpec.text) {
      const textId = `text_${Math.random().toString(36).substring(2, 7)}`
      component.nodes[textId] = {
        type: 'text',
        value: compileExpression(childSpec.text),
      }
      childNode.children.push(textId)
    }

    component.nodes[childId] = childNode
    parent.children = [...(parent.children || []), childId]
    return childId
  }

  static removeNode(component, nodeId) {
    if (nodeId === 'root') {
      throw new Error('Cannot remove root node')
    }
    for (const node of Object.values(component.nodes || {})) {
      if (node?.children && Array.isArray(node.children)) {
        node.children = node.children.filter((cid) => cid !== nodeId)
      }
    }
    delete component.nodes[nodeId]
  }

  static setVariable(component, name, initialValue) {
    if (!component.variables) {
      component.variables = {}
    }
    component.variables[name] = {
      name,
      initialValue: {
        type: 'value',
        value: initialValue,
      },
    }
  }
}
