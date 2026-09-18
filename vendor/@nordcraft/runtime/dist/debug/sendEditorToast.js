export function sendEditorToast(title, message, { type = 'neutral', }) {
    window.parent?.postMessage({
        type: 'emitToast',
        toastType: type,
        title,
        message,
    }, '*');
}
//# sourceMappingURL=sendEditorToast.js.map