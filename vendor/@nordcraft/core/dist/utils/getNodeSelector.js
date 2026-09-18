import { getPathClassName } from '../styling/className';
import { variantSelector } from '../styling/variantSelector';
export function getNodeSelector(path, { componentName, nodeId, variant } = {}) {
    let selector = `.${getPathClassName(path)}`;
    if (componentName) {
        // Do not allow classes to start with a number, for example a page named "404" would result in a selector starting with a number which is invalid in CSS.
        selector += startsWithNumber(componentName)
            ? `._${componentName}`
            : `.${componentName}`;
    }
    if (nodeId) {
        selector += `\\:${nodeId}`;
    }
    // Escape unescaped slashes in the path to avoid issues with CSS selector parsing
    if (selector.indexOf('/') !== -1) {
        selector = selector.replace(/(^|[^\\])\//g, '$1\\/');
    }
    if (variant) {
        selector += variantSelector(variant);
    }
    return selector;
}
function startsWithNumber(str) {
    if (!str)
        return false;
    const code = str.charCodeAt(0);
    return code >= 48 && code <= 57;
}
//# sourceMappingURL=getNodeSelector.js.map