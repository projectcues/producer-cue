import { isDefined } from '@nordcraft/core/dist/utils/util';
export function omitSubnodeStyleForComponent(component) {
    const clone = structuredClone(component);
    Object.entries(clone?.nodes ?? {}).forEach(([nodeId, node]) => {
        if (isDefined(node) &&
            (node.type === 'element' || node.type === 'component') &&
            nodeId !== 'root') {
            delete node.style;
            delete node.animations;
            node.variants = node.variants?.map(({ customProperties }) => ({
                customProperties,
            }));
        }
    });
    return clone;
}
//# sourceMappingURL=omitStyle.js.map