export function importFromTokensStudio(figmaTokens, themeName = 'FigmaImported') {
  const colorTokens = []
  const spacingTokens = []
  const radiusTokens = []

  function walk(obj, prefix = '') {
    for (const [key, val] of Object.entries(obj)) {
      if (val && typeof val === 'object') {
        if ('value' in val) {
          const tokenName = prefix ? `${prefix}-${key}` : key
          const rawVal = String(val.value)
          const type = val.type || ''

          if (type === 'color' || rawVal.startsWith('#') || rawVal.startsWith('rgb')) {
            colorTokens.push({ name: tokenName, type: 'value', value: rawVal })
          } else if (type === 'spacing' || type === 'space') {
            spacingTokens.push({ name: tokenName, type: 'value', value: rawVal })
          } else if (type === 'borderRadius') {
            radiusTokens.push({ name: tokenName, type: 'value', value: rawVal })
          } else {
            colorTokens.push({ name: tokenName, type: 'value', value: rawVal })
          }
        } else {
          walk(val, prefix ? `${prefix}-${key}` : key)
        }
      }
    }
  }

  walk(figmaTokens)

  return {
    name: themeName,
    scheme: 'light',
    color: [{ name: 'figma', tokens: colorTokens }],
    spacing: [{ name: 'Default', tokens: spacingTokens }],
    'border-radius': [{ name: 'Default', tokens: radiusTokens }],
    fonts: [],
  }
}

export function exportToTokensStudio(nordcraftTheme) {
  const output = {
    global: {},
  }

  if (nordcraftTheme.color && Array.isArray(nordcraftTheme.color)) {
    output.global.color = {}
    for (const group of nordcraftTheme.color) {
      for (const token of group.tokens || []) {
        output.global.color[token.name] = {
          value: token.value,
          type: 'color',
        }
      }
    }
  }

  if (nordcraftTheme.spacing && Array.isArray(nordcraftTheme.spacing)) {
    output.global.spacing = {}
    for (const group of nordcraftTheme.spacing) {
      for (const token of group.tokens || []) {
        output.global.spacing[token.name] = {
          value: token.value,
          type: 'spacing',
        }
      }
    }
  }

  if (nordcraftTheme['border-radius'] && Array.isArray(nordcraftTheme['border-radius'])) {
    output.global.borderRadius = {}
    for (const group of nordcraftTheme['border-radius']) {
      for (const token of group.tokens || []) {
        output.global.borderRadius[token.name] = {
          value: token.value,
          type: 'borderRadius',
        }
      }
    }
  }

  return output
}
