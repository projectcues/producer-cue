export const storeScrollState = (key = '', querySelector = '[data-id]', comparerFn = (node) => node.getAttribute('data-id')) => {
    const scrollPositions = {};
    Array.from(document.querySelectorAll(querySelector)).forEach((node) => {
        const nodeId = comparerFn(node);
        if (nodeId && (node.scrollTop || node.scrollLeft)) {
            scrollPositions[nodeId] = {
                y: node.scrollTop,
                x: node.scrollLeft,
            };
        }
    });
    // Always store window scroll position as well
    scrollPositions['__window'] = {
        y: window.scrollY,
        x: window.scrollX,
    };
    sessionStorage.setItem(`scroll-position(${key})`, JSON.stringify(scrollPositions));
    return getScrollStateRestorer(key);
};
export const getScrollStateRestorer = (key) => (selectorFn) => {
    const { __window, ...rest } = JSON.parse(sessionStorage.getItem(`scroll-position(${key})`) ?? '{}');
    if (!__window) {
        return;
    }
    Object.entries(rest).forEach(([nodeId, scrollPosition]) => {
        const domNode = selectorFn(nodeId);
        if (!domNode) {
            return;
        }
        if (scrollPosition?.y) {
            domNode.scrollTop = scrollPosition.y;
        }
        if (scrollPosition?.x) {
            domNode.scrollLeft = scrollPosition.x;
        }
    });
    window.scrollTo(__window.x, __window.y);
};
//# sourceMappingURL=storeScrollState.js.map