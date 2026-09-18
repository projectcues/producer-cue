let localCounter = 0;
const requestCounters = new WeakMap();
function getRequestCounter(key) {
    if (!requestCounters.has(key)) {
        requestCounters.set(key, { idCounter: 0 });
    }
    return requestCounters.get(key);
}
const handler = (_, ctx) => {
    if (ctx.env.isServer) {
        const counter = getRequestCounter(ctx.env.request);
        return `_id_${counter.idCounter++}_`;
    }
    return `_id_${localCounter++}_`;
};
export default handler;
//# sourceMappingURL=handler.js.map