import { isDefined } from '../utils/util';
export function stringifySyntaxNode(node) {
    switch (node.type) {
        case 'primitive':
            switch (node.name) {
                case '*':
                    return node.name;
                default:
                    return `<${node.name}>`;
            }
        case 'custom':
            return {
                'font-family': '<custom-ident> | <string>',
            }[node.name];
        case 'keyword':
            return node.keywords.join(' | ');
        default:
            throw new Error(`Unknown syntax node type: ${node.type}`);
    }
}
export function renderSyntaxDefinition(key, { syntax, inherits, initialValue }, theme) {
    let value = initialValue;
    if (initialValue?.includes('var(--')) {
        value = solveVarRecursively(initialValue, theme);
    }
    // Fallback in-case of no reference
    if (!isDefined(value) &&
        (syntax.type === 'primitive' || syntax.type === 'custom')) {
        value = FALLBACK_VALUES[syntax.name];
    }
    return `@property ${key} {
  syntax: "${stringifySyntaxNode(syntax)}";
  inherits: ${String(inherits)};
  initial-value: ${value};
}`;
}
function solveVarRecursively(initialValue, theme, depth = 0) {
    // This makes a crazy assumption that no person would create a web of style-variable referencing deeper than 256
    if (depth > 2 ** 8) {
        return null;
    }
    const VAR_REGEX = /var\((--[a-zA-Z0-9-_]+)\)/g;
    let match;
    while ((match = VAR_REGEX.exec(initialValue))) {
        const varName = match[1];
        const def = theme.propertyDefinitions?.[varName];
        if (!isDefined(def)) {
            return null;
        }
        const value = def.initialValue;
        const returnValue = initialValue.replace(match[0], String(value));
        if (returnValue.includes('var(--')) {
            return solveVarRecursively(returnValue, theme, depth + 1);
        }
        return returnValue;
    }
    return null;
}
const FALLBACK_VALUES = {
    color: 'transparent',
    length: '0px',
    'length-percentage': '0px',
    percentage: '0%',
    number: '0',
    angle: '0deg',
    time: '0s',
    resolution: '0dpi',
    'custom-ident': '',
    string: '""',
    image: 'none',
    url: 'none',
    'transform-function': 'none',
    'transform-list': 'none',
    integer: '0',
    'font-family': 'sans-serif',
    '*': '',
};
export const appendUnit = (value, unit) => isDefined(value) && isDefined(unit) && !String(value).endsWith(unit)
    ? `${value}${unit}`
    : value;
//# sourceMappingURL=customProperty.js.map