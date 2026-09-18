import { appendUnit } from './customProperty';
import { generateAlphabeticName, hash } from './hash';
// Classnames are reused a lot, and JS hashing is expensive, so there is benefit in caching them in a native hashmap.
const CLASSNAME_LOOKUP = new Map();
export const getClassName = (object) => {
    const stringified = JSON.stringify(object.filter((item) => item !== null && // Skip nullish values
        item !== undefined &&
        (Array.isArray(item) ? item.length > 0 : true) && // Skip empty arrays/objects
        (typeof item === 'object' ? Object.keys(item).length > 0 : true)));
    if (CLASSNAME_LOOKUP.has(stringified)) {
        return CLASSNAME_LOOKUP.get(stringified);
    }
    const className = generateAlphabeticName(hash(stringified));
    CLASSNAME_LOOKUP.set(stringified, className);
    return className;
};
export const getPathClassName = (path) => generateAlphabeticName(hash(path));
const getStaticCustomPropertyStyles = (customProperties) => Object.fromEntries(Object.entries(customProperties ?? {})
    .filter(([, value]) => value.formula?.type === 'value')
    .map(([key, value]) => [
    key,
    appendUnit(value.formula?.type === 'value' ? value.formula.value : undefined, value.unit),
]));
const mergeStaticStyle = (style, customProperties) => {
    const staticStyles = getStaticCustomPropertyStyles(customProperties);
    const merged = { ...staticStyles, ...style };
    return Object.keys(merged).length > 0 ? merged : undefined;
};
export const getStaticStyleAndVariants = (node) => {
    const variants = node.variants ??
        node.style?.variants;
    const staticStyle = mergeStaticStyle(node.style, node.customProperties ?? {});
    const mappedVariants = variants?.map((variant) => ({
        ...variant,
        style: mergeStaticStyle(variant.style, variant.customProperties ?? {}),
    }));
    return [
        staticStyle,
        mappedVariants && mappedVariants.length > 0 ? mappedVariants : undefined,
    ];
};
export const toValidClassName = (input, escapeSpecialCharacters = false) => {
    // Replace invalid characters with hyphens
    let className = input
        // Remove leading and trailing whitespace
        .trim()
        // Replace whitespace with hyphens
        .replace(/\s+/g, '-');
    if (escapeSpecialCharacters) {
        className = className.replace(/[^a-zA-Z0-9-_]/g, (match) => `\\${match}`);
    }
    // Ensure the class name doesn't start with a number or special character
    if (className.length > 0) {
        const code = className.charCodeAt(0);
        if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
            className = `_${className}`;
        }
    }
    return className;
};
//# sourceMappingURL=className.js.map