/**
 * Mathematical Color Space & WCAG 2.1 / APCA Accessibility Contrast Utilities
 */

export function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(clean, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

export function rgbToHex(rgb) {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r)))
    .toString(16)
    .padStart(2, '0')
  const g = Math.max(0, Math.min(255, Math.round(rgb.g)))
    .toString(16)
    .padStart(2, '0')
  const b = Math.max(0, Math.min(255, Math.round(rgb.b)))
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}`.toUpperCase()
}

export function rgbToHsl(rgb) {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToRgb(hsl) {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  if (s === 0) {
    const val = Math.round(l * 255)
    return { r: val, g: val, b: val }
  }

  const hue2rgb = (p, q, t) => {
    let vt = t
    if (vt < 0) vt += 1
    if (vt > 1) vt -= 1
    if (vt < 1 / 6) return p + (q - p) * 6 * vt
    if (vt < 1 / 2) return q
    if (vt < 2 / 3) return p + (q - p) * (2 / 3 - vt) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

export function getRelativeLuminance(rgb) {
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(colorA, colorB) {
  const lumA = getRelativeLuminance(hexToRgb(colorA))
  const lumB = getRelativeLuminance(hexToRgb(colorB))
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

export function checkWcagAA(foreground, background, isLargeText = false) {
  const ratio = getContrastRatio(foreground, background)
  const requiredRatio = isLargeText ? 3.0 : 4.5
  return {
    pass: ratio >= requiredRatio,
    ratio: Math.round(ratio * 100) / 100,
    requiredRatio,
  }
}

export function generateTonalScale(baseHex) {
  const baseRgb = hexToRgb(baseHex)
  const baseHsl = rgbToHsl(baseRgb)

  const lightnessMap = {
    50: 97,
    100: 94,
    200: 86,
    300: 74,
    400: 60,
    500: baseHsl.l,
    600: Math.max(12, baseHsl.l * 0.8),
    700: Math.max(10, baseHsl.l * 0.65),
    800: Math.max(8, baseHsl.l * 0.48),
    900: Math.max(5, baseHsl.l * 0.32),
  }

  const result = {}
  for (const [step, targetL] of Object.entries(lightnessMap)) {
    const targetS = Number(step) < 200 ? Math.max(20, baseHsl.s * 0.7) : baseHsl.s
    const shadeRgb = hslToRgb({
      h: baseHsl.h,
      s: targetS,
      l: targetL,
    })
    result[step] = rgbToHex(shadeRgb)
  }

  return result
}
