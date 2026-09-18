import { CSS_VAR_SCROLL_HEIGHT } from './const.js';
import { postMessageToEditor } from './postMessageToEditor.js';
let _lastScrollHeight = 0;
function resizeCanvas({ force, viewport, }) {
    const domNode = document.getElementById('App');
    // First pass: Set base height to resolve relative units the same way each render
    domNode.style.maxHeight = `${viewport.height}px`;
    // Temporarily set the scroll height variable to the actual window height
    // so that vh units resolve relative to the simulated viewport height
    domNode.style.setProperty(CSS_VAR_SCROLL_HEIGHT, String(Math.round(window.innerHeight)));
    // Force reflow
    void domNode.offsetHeight;
    // Measure the actual content size
    const scrollHeight = Math.round(Math.max(domNode.scrollHeight, viewport.height));
    // Update viewport height ratio for vh to work inside the canvas
    domNode.style.setProperty(CSS_VAR_SCROLL_HEIGHT, String(scrollHeight));
    // Restore original styles
    domNode.style.removeProperty('max-height');
    if (!force && scrollHeight === _lastScrollHeight) {
        return;
    }
    _lastScrollHeight = scrollHeight;
    postMessageToEditor({
        type: 'documentScrollSize',
        scrollHeight,
    });
}
let cancelRequestResizeCanvas = null;
export const requestResizeCanvas = (options = {}) => {
    if (cancelRequestResizeCanvas) {
        cancelAnimationFrame(cancelRequestResizeCanvas);
    }
    if (options.enabled === false) {
        return;
    }
    cancelRequestResizeCanvas = requestAnimationFrame(() => {
        resizeCanvas({
            force: options.force ?? false,
            viewport: {
                height: options.viewport?.height ?? 740,
            },
        });
        cancelRequestResizeCanvas = null;
    });
};
//# sourceMappingURL=resizeCanvas.js.map