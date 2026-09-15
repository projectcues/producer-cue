import { checkWcagAA } from '../tokens/colorUtils.js'

export class ValidatorGate {
  static validate(component) {
    const issues = []
    const nodes = component.nodes || {}

    if (!nodes.root) {
      issues.push({
        severity: 'error',
        code: 'MISSING_ROOT',
        message: 'Component is missing a "root" node.',
      })
    }

    for (const [nodeId, node] of Object.entries(nodes)) {
      if (!node) continue

      if (node.children && Array.isArray(node.children)) {
        for (const childId of node.children) {
          if (!nodes[childId]) {
            issues.push({
              severity: 'error',
              code: 'BROKEN_CHILD_REF',
              message: `Node "${nodeId}" references non-existent child "${childId}".`,
              nodeId,
            })
          }
        }
      }

      if (node.type === 'element') {
        const tag = node.tag?.toLowerCase()

        if (tag === 'button') {
          const hasChildren = node.children && node.children.length > 0
          const hasAriaLabel = node.attrs?.['aria-label']
          if (!hasChildren && !hasAriaLabel) {
            issues.push({
              severity: 'error',
              code: 'A11Y_EMPTY_BUTTON',
              message: 'Buttons must have either text content or an "aria-label" attribute.',
              nodeId,
            })
          }
        }

        if (tag === 'img') {
          if (!node.attrs?.['alt']) {
            issues.push({
              severity: 'error',
              code: 'A11Y_MISSING_ALT',
              message: 'Image tags must have an "alt" attribute for screen readers.',
              nodeId,
            })
          }
        }

        if (tag === 'input') {
          const hasAriaLabel = node.attrs?.['aria-label']
          const hasAriaLabelledBy = node.attrs?.['aria-labelledby']
          const hasId = node.attrs?.['id']
          if (!hasAriaLabel && !hasAriaLabelledBy && !hasId) {
            issues.push({
              severity: 'warning',
              code: 'A11Y_INPUT_LABEL',
              message: 'Input fields should have an associated label or "aria-label".',
              nodeId,
            })
          }
        }

        const color = node.style?.color
        const bg = node.style?.['background-color'] || node.style?.background
        if (typeof color === 'string' && color.startsWith('#') && typeof bg === 'string' && bg.startsWith('#')) {
          const contrast = checkWcagAA(color, bg)
          if (!contrast.pass) {
            issues.push({
              severity: 'warning',
              code: 'A11Y_LOW_CONTRAST',
              message: `Low contrast between text (${color}) and background (${bg}): ratio is ${contrast.ratio}:1 (minimum 4.5:1 required).`,
              nodeId,
            })
          }
        }
      }
    }

    const errorCount = issues.filter((i) => i.severity === 'error').length
    const warningCount = issues.filter((i) => i.severity === 'warning').length
    const score = Math.max(0, 100 - errorCount * 25 - warningCount * 5)
    const valid = errorCount === 0

    return {
      valid,
      score,
      issues,
    }
  }
}
