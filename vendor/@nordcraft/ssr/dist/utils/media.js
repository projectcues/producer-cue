export const isCloudflareImagePath = (path) => typeof path === 'string' && path.startsWith('/cdn-cgi/imagedelivery/');
/**
 * Make all relative 'src' paths in a component absolute
 */
export const transformRelativePaths = (urlOrigin) => (component) => ({
    ...component,
    nodes: Object.entries(component.nodes ?? {}).reduce((acc, [key, node]) => {
        return {
            ...acc,
            [key]: {
                ...node,
                ...(node?.type === 'element'
                    ? {
                        attrs: Object.entries(node.attrs ?? {}).reduce((acc, [key, formula]) => {
                            if (['src'].includes(key) &&
                                formula?.type === 'value' &&
                                typeof formula.value === 'string') {
                                return {
                                    ...acc,
                                    [key]: {
                                        ...formula,
                                        value: new URL(formula.value, urlOrigin).href,
                                    },
                                };
                            }
                            return { ...acc, [key]: formula };
                        }, {}),
                    }
                    : {}),
            },
        };
    }, {}),
});
//# sourceMappingURL=media.js.map