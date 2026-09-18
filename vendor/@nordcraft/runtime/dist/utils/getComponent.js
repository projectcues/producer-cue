let componentMap;
/**
 * Project components is not expected to change during runtime, so we can memoize the components in a map for faster lookup.
 */
export const getComponent = (key, components, useCache = true) => useCache
    ? (componentMap ??= new Map(components.map((c) => [c.name, c]))).get(key)
    : components.find((c) => c.name === key);
//# sourceMappingURL=getComponent.js.map