export const postMessageToEditor = (message) => {
    window.parent?.postMessage(message, '*');
};
//# sourceMappingURL=postMessageToEditor.js.map