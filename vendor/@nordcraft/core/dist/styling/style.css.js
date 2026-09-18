import { omitKeys } from '../utils/collections.js';
import { isDefined } from '../utils/util.js';
import { getClassName, getStaticStyleAndVariants, toValidClassName, } from './className.js';
import { getThemeCss } from './theme.js';
import { variantSelector } from './variantSelector.js';
const LEGACY_BREAKPOINTS = {
    large: 1440,
    small: 576,
    medium: 960,
};
export function kebabCase(string) {
    return string
        .split('')
        .map((char, index) => {
        return 'ABCDEFGHIJKLMNOPQRSTYVWXYZ'.includes(char)
            ? (index === 0 ? '' : '-') + char.toLocaleLowerCase()
            : char;
    })
        .join('');
}
const SIZE_PROPERTIES = new Set([
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'margin',
    'margin-top',
    'margin-left',
    'margin-bottom',
    'margin-right',
    'padding',
    'padding-top',
    'padding-left',
    'padding-bottom',
    'padding-right',
    'gap',
    'gap-x',
    'gap-y',
    'border-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-width',
    'border-top-width',
    'border-left-width',
    'border-bottom-width',
    'border-right-width',
    'font-size',
    'top',
    'right',
    'bottom',
    'left',
    'outline-width',
]);
export const styleToCss = (style) => {
    return Object.entries(style ?? {})
        .map(([property, value]) => {
        if (!isDefined(value)) {
            // ignore undefined/null values
            return;
        }
        const propertyName = kebabCase(property);
        const propertyValue = String(Number(value)) === String(value) &&
            SIZE_PROPERTIES.has(propertyName)
            ? `${Number(value) * 4}px`
            : value;
        return `${propertyName}:${propertyValue};`;
    })
        .filter(Boolean)
        .join('\n      ');
};
export const getNodeStyles = (node, classHash, animationHashes = new Set()) => {
    try {
        const [_style, styleVariants] = getStaticStyleAndVariants(node);
        const style = omitKeys(_style ?? {}, ['variants', 'breakpoints', 'shadows']);
        const renderVariant = (selector, style, options) => {
            const scrollbarStyles = Object.entries(style ?? {}).filter(([key]) => key === 'scrollbar-width');
            // If selectorCss is empty, we don't need to render the selector
            let styles = styleToCss(style);
            if (options?.startingStyle) {
                styles = `
    @starting-style {
      ${styles}
    }`;
            }
            const scrollbarCSS = scrollbarStyles.length > 0
                ? `

    ${selector}::-webkit-scrollbar {
    ${scrollbarStyles
                    .map(([_, value]) => {
                    switch (value) {
                        case 'none':
                            return 'width: 0;';
                        case 'thinn':
                        case 'thin':
                            return 'width: 4px;';
                        default:
                            return '';
                    }
                })
                    .join('\n')}
    }`
                : '';
            const stylesCSS = styles.length > 0
                ? `

    ${selector} {
      ${styles}
    }`
                : '';
            return stylesCSS + scrollbarCSS;
        };
        const variantsCSS = (styleVariants ?? [])
            .map((variant) => {
            const renderedVariant = renderVariant(`.${classHash}${variantSelector(variant)}`, variant.style, {
                startingStyle: variant.startingStyle,
            });
            if (variant.mediaQuery) {
                return `

    @media (${Object.entries(variant.mediaQuery)
                    .filter(([_, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(') and (')}) {${renderedVariant}
    }`;
            }
            if (variant.breakpoint) {
                return `

    @media (min-width: ${LEGACY_BREAKPOINTS[variant.breakpoint]}px) {${renderedVariant}
    }`;
            }
            return renderedVariant;
        })
            .join('');
        const animationsCSS = node.animations
            ? Object.entries(node.animations)
                .map(([animationName, keyframes]) => {
                // Animation names are stored by their hash, so no need to render them more than once.
                if (animationHashes.has(animationName)) {
                    return '';
                }
                animationHashes.add(animationName);
                return `

    @keyframes ${animationName} {${Object.values(keyframes)
                    .sort((a, b) => Number(a.position) - Number(b.position))
                    .map(({ key, position, value }) => {
                    return `
        ${Number(position) * 100}% {
          ${key}: ${value};
        }`;
                })
                    .join('\n')}
    }`;
            })
                .join('\n')
            : '';
        return renderVariant('.' + classHash, style) + variantsCSS + animationsCSS;
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return '';
    }
};
export const createStylesheet = (root, components, themes, options
// eslint-disable-next-line max-params
) => {
    const hashes = new Set();
    const animationHashes = new Set();
    // Get fonts used on the page
    const fonts = getAllFonts(components);
    //Exclude fonts that are not used on this page.
    let stylesheet = getThemeCss(Object.fromEntries(Object.entries(themes).map(([key, theme]) => 'breakpoints' in theme
        ? [
            key,
            {
                ...theme,
                fontFamily: Object.fromEntries(Object.entries(theme.fontFamily).filter(([key, value]) => value.default ?? fonts.has('--font-' + key))),
            },
        ]
        : [
            key,
            {
                ...theme,
                fonts: theme.fonts,
            },
        ])), options);
    // Make sure that CSS for dependencies are rendered first so that instance styles can override
    const visitedComponents = new Set();
    function insertComponentStyles(component, package_name) {
        if (visitedComponents.has(component.name)) {
            return;
        }
        visitedComponents.add(component.name);
        if (!component.nodes) {
            // eslint-disable-next-line no-console
            console.warn('Unable to find nodes for component', component.name);
            return;
        }
        Object.entries(component.nodes).forEach(([id, node]) => {
            if (!isDefined(node)) {
                return;
            }
            if (node.type === 'component') {
                const childComponent = components.find((c) => c.name ===
                    [node.package ?? package_name, node.name]
                        .filter((c) => c)
                        .join('/'));
                if (childComponent) {
                    insertComponentStyles(childComponent, node.package ?? package_name);
                    stylesheet += getNodeStyles(node, toValidClassName(`${component.name}:${id}`, true), animationHashes);
                    return;
                }
            }
            if (node.type !== 'element') {
                return;
            }
            const classHash = getClassName(getStaticStyleAndVariants(node));
            if (hashes.has(classHash)) {
                return '';
            }
            hashes.add(classHash);
            stylesheet += getNodeStyles(node, classHash, animationHashes);
        });
    }
    insertComponentStyles(root);
    return stylesheet;
};
export const getAllFonts = (components) => {
    return new Set(components
        .flatMap((component) => {
        return Object.values(component.nodes ?? {}).flatMap((node) => {
            if (node?.type === 'element') {
                return [
                    node.style?.fontFamily,
                    node.style?.['font-family'],
                    ...(node.variants?.map((v) => v.style?.fontFamily ?? v.style?.['font-family']) ?? []),
                ].filter(isDefined);
            }
            return [];
        });
    })
        .map((f) => String(f).replace('var(', '').replace(')', '').replaceAll("'", '')));
};
//# sourceMappingURL=style.css.js.map