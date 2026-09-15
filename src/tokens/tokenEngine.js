import { checkWcagAA, generateTonalScale } from './colorUtils.js'

export function generateDesignSystemTheme(config) {
  const primaryScale = generateTonalScale(config.primarySeed)
  const neutralScale = generateTonalScale(config.neutralSeed || '#64748B')
  const isDark = config.scheme === 'dark'

  const semanticTokens = isDark
    ? {
        'bg-canvas': neutralScale['900'] || '#0F172A',
        'bg-surface': neutralScale['800'] || '#1E293B',
        'bg-subtle': neutralScale['700'] || '#334155',
        'text-primary': neutralScale['50'] || '#F8FAFC',
        'text-secondary': neutralScale['300'] || '#CBD5E1',
        'text-muted': neutralScale['400'] || '#94A3B8',
        'border-default': neutralScale['700'] || '#334155',
        'border-subtle': neutralScale['800'] || '#1E293B',
        'brand-default': primaryScale['500'] || '#3B82F6',
        'brand-hover': primaryScale['400'] || '#60A5FA',
        'brand-active': primaryScale['600'] || '#2563EB',
        'brand-contrast': '#FFFFFF',
      }
    : {
        'bg-canvas': '#FFFFFF',
        'bg-surface': neutralScale['50'] || '#F8FAFC',
        'bg-subtle': neutralScale['100'] || '#F1F5F9',
        'text-primary': neutralScale['900'] || '#0F172A',
        'text-secondary': neutralScale['700'] || '#334155',
        'text-muted': neutralScale['500'] || '#64748B',
        'border-default': neutralScale['200'] || '#E2E8F0',
        'border-subtle': neutralScale['100'] || '#F1F5F9',
        'brand-default': primaryScale['600'] || '#2563EB',
        'brand-hover': primaryScale['700'] || '#1D4ED8',
        'brand-active': primaryScale['800'] || '#1E40AF',
        'brand-contrast': '#FFFFFF',
      }

  const contrastChecks = [
    {
      pair: 'Text Primary on Canvas',
      fg: semanticTokens['text-primary'],
      bg: semanticTokens['bg-canvas'],
    },
    {
      pair: 'Text Primary on Surface',
      fg: semanticTokens['text-primary'],
      bg: semanticTokens['bg-surface'],
    },
    {
      pair: 'Brand Contrast on Brand Default',
      fg: semanticTokens['brand-contrast'],
      bg: semanticTokens['brand-default'],
    },
  ]

  const contrastReport = contrastChecks.map((check) => {
    const result = checkWcagAA(check.fg, check.bg)
    return {
      pair: check.pair,
      foreground: check.fg,
      background: check.bg,
      ratio: result.ratio,
      pass: result.pass,
    }
  })

  const colorTokenGroups = [
    {
      name: 'primary',
      tokens: Object.entries(primaryScale).map(([step, val]) => ({
        name: `primary-${step}`,
        type: 'value',
        value: val,
      })),
    },
    {
      name: 'neutral',
      tokens: Object.entries(neutralScale).map(([step, val]) => ({
        name: `neutral-${step}`,
        type: 'value',
        value: val,
      })),
    },
    {
      name: 'semantic',
      tokens: Object.entries(semanticTokens).map(([name, val]) => ({
        name,
        type: 'value',
        value: val,
      })),
    },
  ]

  const spacingTokens = [
    { name: 'space-1', type: 'value', value: '0.25rem' },
    { name: 'space-2', type: 'value', value: '0.5rem' },
    { name: 'space-3', type: 'value', value: '0.75rem' },
    { name: 'space-4', type: 'value', value: '1rem' },
    { name: 'space-6', type: 'value', value: '1.5rem' },
    { name: 'space-8', type: 'value', value: '2rem' },
    { name: 'space-12', type: 'value', value: '3rem' },
  ]

  const fontSizeTokens = [
    { name: 'font-size-xs', type: 'value', value: '0.75rem' },
    { name: 'font-size-sm', type: 'value', value: '0.875rem' },
    { name: 'font-size-base', type: 'value', value: '1rem' },
    { name: 'font-size-lg', type: 'value', value: '1.125rem' },
    { name: 'font-size-xl', type: 'value', value: '1.25rem' },
    { name: 'font-size-2xl', type: 'value', value: '1.5rem' },
    { name: 'font-size-3xl', type: 'value', value: '1.875rem' },
    { name: 'font-size-4xl', type: 'value', value: '2.25rem' },
  ]

  const themeObject = {
    scheme: config.scheme || 'light',
    color: colorTokenGroups,
    fonts: [
      {
        name: 'sans',
        family: config.fontFamily || 'Inter',
        provider: 'google',
        type: 'sans-serif',
      },
    ],
    'font-size': [{ name: 'Default', tokens: fontSizeTokens }],
    spacing: [{ name: 'Default', tokens: spacingTokens }],
  }

  const cssLines = [':root, :host {']
  for (const group of colorTokenGroups) {
    for (const token of group.tokens) {
      cssLines.push(`  --${token.name}: ${token.value};`)
    }
  }
  for (const token of spacingTokens) {
    cssLines.push(`  --${token.name}: ${token.value};`)
  }
  for (const token of fontSizeTokens) {
    cssLines.push(`  --${token.name}: ${token.value};`)
  }
  cssLines.push('}')

  return {
    theme: themeObject,
    cssVariables: cssLines.join('\n'),
    contrastReport,
  }
}
