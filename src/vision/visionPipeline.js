import { rgbToHex } from '../tokens/colorUtils.js'

export function getVisionSystemPrompt(config = {}) {
  return `
You are Producer Cue Vision: World-Class UI/UX Vision Analyzer and Frontend Architect by Project Cues, Inc.
Analyze the provided user interface screenshot, wireframe, or sketch, and translate it into a pixel-accurate, accessible Compact Component.

### OUTPUT SCHEMA
You MUST return ONLY valid JSON matching this schema:
{
  "name": "ExtractedUIComponent",
  "description": "Component recreated from visual screenshot",
  "variables": {
    "stateName": { "initialValue": any }
  },
  "root": {
    "tag": "div" | "button" | "p" | "h1" | "span" | "input",
    "text": "Optional text or expression",
    "style": { "display": "flex", ... },
    "attrs": { ... },
    "children": [ ... ]
  }
}
${config.preferredScheme ? `Note: Render this component using a "${config.preferredScheme}" theme color palette.` : ''}
${config.contextNotes ? `Additional Context: ${config.contextNotes}` : ''}
`
}

export function extractDominantPalette(pixels) {
  if (!pixels || pixels.length === 0) {
    return {
      background: '#0F172A',
      primary: '#3B82F6',
      text: '#F8FAFC',
    }
  }

  const hexCounts = {}
  for (const p of pixels) {
    const hex = rgbToHex(p)
    hexCounts[hex] = (hexCounts[hex] || 0) + 1
  }

  const sorted = Object.entries(hexCounts).sort((a, b) => b[1] - a[1])
  const background = sorted[0]?.[0] || '#0F172A'
  const text = sorted.length > 1 ? sorted[sorted.length - 1][0] : '#FFFFFF'
  const primary = sorted.length > 2 ? sorted[1][0] : '#2563EB'

  return { background, primary, text }
}

export function parseVisionOutput(rawText) {
  let clean = rawText.trim()
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '').trim()
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '').trim()
  }

  try {
    const parsed = JSON.parse(clean)
    if (!parsed.name || !parsed.root) {
      throw new Error('Parsed vision JSON missing "name" or "root" properties')
    }
    return parsed
  } catch (err) {
    throw new Error(`Failed to parse vision model output: ${err.message}`)
  }
}
