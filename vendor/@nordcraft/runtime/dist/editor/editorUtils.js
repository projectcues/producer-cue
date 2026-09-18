export const debounce = (func, wait, immediate = false) => {
    let timeout = undefined;
    return () => {
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func();
        }, wait);
        if (callNow) {
            func();
        }
    };
};
export const throttleToIdleCallback = (func) => {
    let scheduled = false;
    return () => {
        if (!scheduled) {
            scheduled = true;
            (globalThis.requestIdleCallback ?? globalThis.requestAnimationFrame)(() => {
                func();
                scheduled = false;
            });
        }
    };
};
//# sourceMappingURL=editorUtils.js.map