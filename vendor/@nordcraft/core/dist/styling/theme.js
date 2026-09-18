import { isDefined } from '../utils/util';
import { renderSyntaxDefinition } from './customProperty';
import { RESET_STYLES, THEME_DATA_ATTRIBUTE } from './theme.const';
export const getThemeCss = (themes, options) => {
    const [themesV1, themesV2] = Object.entries(themes).reduce(([legacy, modern], [key, value]) => {
        if ('breakpoints' in value) {
            legacy[key] = value;
        }
        else {
            modern[key] = value;
        }
        return [legacy, modern];
    }, [{}, {}]);
    return `
  ${Object.values(themesV1)
        .map((t) => getOldThemeCss(t))
        .join('\n')}

  ${Object.values(themesV2)
        .map((themeV2) => {
        return `
  ${Object.entries(themeV2.propertyDefinitions ?? {})
            .filter(([, property]) => isDefined(property))
            .map(([propertyName, property]) => renderSyntaxDefinition(propertyName, property, themeV2))
            .join('\n')}

  ${renderThemeValues(':host, :root', getThemeEntries(themeV2, themeV2.default))}
  ${renderThemeValues(':host, :root', getThemeEntries(themeV2, themeV2.defaultDark), '@media (prefers-color-scheme: dark)')}
  ${renderThemeValues(':host, :root', getThemeEntries(themeV2, themeV2.defaultLight), '@media (prefers-color-scheme: light)')}
  ${Object.entries(themeV2.themes ?? {})
            .map(([key, _t]) => renderThemeValues(`[${THEME_DATA_ATTRIBUTE}~="${key}"]`, getThemeEntries(themeV2, key)))
            .join('\n')}
    `;
    })
        .join('\n')}

${options.includeResetStyle ? RESET_STYLES : ''}
@layer base {
  ${options.createFontFaces
        ? Object.values(themesV2)
            .map(({ fonts }) => fonts)
            .flat()
            .map((font) => `
    ${(font.variants ?? [])
            .map((variant) => `
    @font-face {
      font-family: "${font.family}";
      font-style: ${variant.italic ? 'italic' : 'normal'};
      font-weight: ${variant.weight};
      font-display: auto;
      src: local("${variant.url.substring(variant.url.lastIndexOf('/') + 1)}"), url("${variant.url.replace('https://fonts.gstatic.com', '/.toddle/fonts/font')}") format("woff2");
    }
    `)
            .join('\n')}
    `)
            .join('\n')
        : ''}
  body, :host {
    /* Color */
    ${Object.values(themesV2)
        .map(({ color }) => color ?? [])
        .flat()
        .flatMap((group) => group.tokens.map((color) => `--${color.name}: ${color.value};`))
        .join('\n')}
    /* Fonts */
    ${Object.values(themesV2)
        .map(({ fonts }) => fonts)
        .flat()
        .map((font) => `--font-${font.name}: '${font.family}',${font.type};`)
        .join('\n')}

    /* Font size */
    ${Object.values(themesV2)
        .map(({ 'font-size': fontSize }) => fontSize ?? [])
        .flat()
        .flatMap((group) => group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
        ? `var(--${variable.value})`
        : variable.value};`))
        .join('\n')}
    /* Font weight */
    ${Object.values(themesV2)
        .map(({ 'font-weight': fontWeight }) => fontWeight ?? [])
        .flat()
        .flatMap((group) => {
        return group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
            ? `var(--${variable.value})`
            : variable.value};`);
    })
        .join('\n')}
    /* Shadows */
    ${Object.values(themesV2)
        .map(({ shadow }) => shadow ?? [])
        .flat()
        .flatMap((group) => {
        return group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
            ? `var(--${variable.value})`
            : variable.value};`);
    })
        .join('\n')}
    /* Border radius */
    ${Object.values(themesV2)
        .map(({ 'border-radius': borderRadius }) => borderRadius ?? [])
        .flat()
        .flatMap((group) => {
        return group.tokens.map((token) => `--${token.name}: ${token.type === 'variable' ? `var(--${token.value})` : token.value};`);
    })
        .join('\n')}
    /* Spacing */
    ${Object.values(themesV2)
        .map(({ spacing }) => spacing ?? [])
        .flat()
        .map((group) => {
        return group.tokens
            .map((token) => `--${token.name}: ${token.type === 'variable'
            ? `var(--${token.value})`
            : token.value};`)
            .join('\n');
    })
        .join('\n')}
    /* Z-index */
    ${Object.values(themesV2)
        .map(({ 'z-index': zIndex }) => zIndex ?? [])
        .flat()
        .map((group) => {
        return group.tokens
            .map((token) => `--${token.name}: ${token.type === 'variable'
            ? `var(--${token.value})`
            : token.value};`)
            .join('\n');
    })
        .join('\n')}
  }
  @keyframes animation-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes animation-fade-in {
    from {
      opacity:0;
    }
    to {
      opacity:1;
    }
  }
  @keyframes animation-fade-out {
    from {
      opacity:1;
    }
    to {
      opacity:0;
    }
  }
}
`;
};
export const getOldThemeCss = (theme) => {
    const colorVars = Object.entries(theme.colors).flatMap(([color, { variants }]) => Object.entries(variants).map(([variant, { value }]) => `--${color}-${variant}:${value}`));
    return `
body, :host {
  ${Object.entries(theme.fontFamily)
        .map(([name, { value: [family, ...fallback], },]) => `--font-${name}: '${family}',${fallback.join(',')};`)
        .join('\n')}

  ${Object.entries(theme.fontWeight)
        .map(([name, { value }]) => `--font-weight-${name}: ${value};`)
        .join('\n')}

  ${Object.entries(theme.fontSize)
        .map(([name, { value }]) => `--font-size-${name}: ${value};`)
        .join('\n')}

  --spacing:${theme.spacing}rem;
    ${colorVars.join(';\n')};

  --text-xxs:0.625rem;
  --line-height-xxs:0.9rem;

  --text-xs:0.75rem;
  --line-height-xs:1rem;

  --text-sm:0.875rem;
  --line-height-sm:1.25rem;

  --text-base:1rem;
  --line-height-base:1.5rem;

  --text-lg:1.125rem;
  --line-height-lg:1.75rem;

  --text-xl:1.25rem;
  --line-height-xl:1.75rem;

  --text-2xl:1.5rem;
  --line-height-2xl:2rem;

  --text-3xl:1.875rem;
  --line-height-3xl:2.25rem;

  --text-4xl:2.25rem;
  --line-height-4xl:2.5rem;

  --text-5xl:3rem;
  --line-height-5xl:3rem;

  ${Object.entries(theme.shadow)
        .map(([name, { value }]) => `--shadow-${name}:${value};`)
        .join('\n')}
}

${RESET_STYLES}

@keyframes animation-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes animation-fade-in {
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
}
@keyframes animation-fade-out {
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
}`;
};
export function renderThemeValues(selector, entries, mediaQuery) {
    if (Object.entries(entries).length === 0) {
        return '';
    }
    const css = `${selector} {
  ${Object.entries(entries)
        .map(([propertyName, value]) => `${propertyName}: ${value};`)
        .join('\n  ')}
}`;
    if (mediaQuery) {
        return `${mediaQuery} {
      ${css}
    }`;
    }
    return css;
}
export function getThemeEntries(theme, themeName) {
    const entries = {};
    if (!themeName) {
        return entries;
    }
    for (const [propertyName, definition] of Object.entries(theme.propertyDefinitions ?? {})) {
        const value = definition.values?.[themeName];
        if (!isDefined(value)) {
            continue;
        }
        entries[propertyName] = value;
    }
    return entries;
}
//# sourceMappingURL=theme.js.map