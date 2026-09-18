import { stripNodeIdRepeatIndices } from '../../utils/nodes.js';
import { postMessageToEditor } from '../postMessageToEditor.js';
export const handleTextNodeSelection = (node, options = {
    onInput: () => { },
}) => {
    const initialContent = node.textContent;
    node.contentEditable = 'plaintext-only';
    const nodeId = node.getAttribute('data-id');
    postMessageToEditor({
        type: 'highlight',
        highlightedNodeId: stripNodeIdRepeatIndices(nodeId),
        exactHighlightedNodeId: nodeId,
    });
    let isFinished = false;
    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
            e.preventDefault();
            finishEditing();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            node.textContent = initialContent;
            finishEditing();
        }
    };
    const finishEditing = () => {
        if (isFinished) {
            return;
        }
        isFinished = true;
        globalThis.removeEventListener('selected-node-changed', finishEditing);
        node.removeAttribute('contenteditable');
        node.removeEventListener('input', options.onInput);
        node.removeEventListener('keydown', handleKeyDown);
        node.removeEventListener('blur', finishEditing);
        // Clear selected text
        requestAnimationFrame(() => {
            const selection = globalThis.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
        });
        // Loose tab focus from document entirely
        if (document.activeElement === node) {
            ;
            document.activeElement.blur();
        }
        if (node.textContent === initialContent) {
            return;
        }
        postMessageToEditor({
            type: 'updateTextNodeContent',
            innerText: node.textContent,
            nodeId: node.getAttribute('data-node-id'),
        });
    };
    node.addEventListener('input', options.onInput);
    node.addEventListener('keydown', handleKeyDown);
    node.addEventListener('blur', finishEditing, { once: true });
    setTimeout(() => {
        if (isFinished) {
            return;
        }
        globalThis.addEventListener('selected-node-changed', finishEditing, {
            once: true,
        });
    }, 0);
};
//# sourceMappingURL=selection.js.map