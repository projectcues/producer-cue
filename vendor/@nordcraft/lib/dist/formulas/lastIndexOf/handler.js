const handler = ([collection, item]) => {
    if (typeof collection === 'string') {
        return collection.lastIndexOf(item);
    }
    if (Array.isArray(collection)) {
        // Short-circuit for primitive types and references
        const fastIndex = collection.lastIndexOf(item);
        if (fastIndex !== -1) {
            return fastIndex;
        }
        return collection.findLastIndex((i) => globalThis.toddle.isEqual(i, item));
    }
    return null;
};
export default handler;
//# sourceMappingURL=handler.js.map