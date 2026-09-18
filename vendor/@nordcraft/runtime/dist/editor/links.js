import { valueFormula } from '@nordcraft/core/dist/formula/formulaUtils';
/**
 * Modifies all link nodes on a component
 * NOTE: alters in place
 */
export const updateComponentLinks = (component) => {
    // Find all links and add target="_blank" to them
    Object.entries(component.nodes ?? {}).forEach(([_, node]) => {
        if (node?.type === 'element' && node.tag === 'a') {
            if (!node.attrs) {
                node.attrs = {};
            }
            node.attrs['target'] = valueFormula('_blank');
        }
    });
    return component;
};
//# sourceMappingURL=links.js.map