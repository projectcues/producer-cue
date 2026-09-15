import { checkWcagAA, getContrastRatio, getRelativeLuminance, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../tokens/colorUtils.js'

export function autoFixContrast(foregroundHex, backgroundHex, targetRatio = 4.6) {
  const currentCheck = checkWcagAA(foregroundHex, backgroundHex)
  if (currentCheck.pass && currentCheck.ratio >= targetRatio) {
    return foregroundHex
  }

  const bgLum = getRelativeLuminance(hexToRgb(backgroundHex))
  const fgHsl = rgbToHsl(hexToRgb(foregroundHex))

  const step = bgLum < 0.5 ? 2 : -2
  let currentL = fgHsl.l
  let bestHex = foregroundHex

  for (let i = 0; i < 50; i++) {
    currentL += step
    if (currentL > 100) currentL = 100
    if (currentL < 0) currentL = 0

    const candidateRgb = hslToRgb({ h: fgHsl.h, s: fgHsl.s, l: currentL })
    const candidateHex = rgbToHex(candidateRgb)
    const ratio = getContrastRatio(candidateHex, backgroundHex)

    if (ratio >= targetRatio) {
      return candidateHex
    }
    bestHex = candidateHex
    if (currentL === 100 || currentL === 0) break
  }

  return bestHex
}

export function autoHealComponent(component) {
  const healed = JSON.parse(JSON.stringify(component))
  const nodes = healed.nodes || {}
  const fixesApplied = []

  // 1. Prune Broken Child References
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node?.children && Array.isArray(node.children)) {
      node.children = node.children.filter((childId) => {
        const exists = Boolean(nodes[childId])
        if (!exists) {
          fixesApplied.push(`Pruned broken child reference "${childId}" from node "${nodeId}".`)
        }
        return exists
      })
    }
  }

  // 2. Auto-Remediate Accessibility on Elements
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node?.type === 'element') {
      const tag = node.tag?.toLowerCase()
      if (!node.attrs) node.attrs = {}

      if (tag === 'button') {
        const hasChildren = node.children && node.children.length > 0
        const hasAriaLabel = node.attrs['aria-label']
        if (!hasChildren && !hasAriaLabel) {
          node.attrs['aria-label'] = { type: 'value', value: 'Interactive Button' }
          fixesApplied.push(`Injected missing aria-label into button node "${nodeId}".`)
        }
      }

      if (tag === 'img') {
        if (!node.attrs.alt) {
          node.attrs.alt = { type: 'value', value: 'Descriptive graphic' }
          fixesApplied.push(`Injected missing alt attribute into img node "${nodeId}".`)
        }
      }

      if (tag === 'input') {
        if (!node.attrs['aria-label'] && !node.attrs['aria-labelledby'] && !node.attrs.id) {
          node.attrs['aria-label'] = { type: 'value', value: 'Input field' }
          fixesApplied.push(`Injected missing aria-label into input node "${nodeId}".`)
        }
      }

      const color = node.style?.color
      const bg = node.style?.['background-color'] || node.style?.background
      if (
        typeof color === 'string' &&
        color.startsWith('#') &&
        typeof bg === 'string' &&
        bg.startsWith('#')
      ) {
        const check = checkWcagAA(color, bg)
        if (!check.pass) {
          const fixedColor = autoFixContrast(color, bg)
          node.style.color = fixedColor
          fixesApplied.push(
            `Auto-shifted contrast on node "${nodeId}" from ${color} to ${fixedColor} (${check.ratio}:1 -> >=4.5:1).`,
          )
        }
      }
    }
  }

  return {
    healedComponent: healed,
    fixesApplied,
  }
}
