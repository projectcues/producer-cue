import type { PointerState, SelectionState } from '../types';
/**
 * Proxy handler for mousedown events on text nodes to manage selection state and communicate with the editor.
 * Handles single, double, and triple clicks for character, word, and full node selection respectively, similar to how standard text editors work.
 */
export declare const handleTextMouseDown: ({ node, x, y, pointerState, selectionState, }: {
    node: HTMLElement;
    x: number;
    y: number;
    pointerState: PointerState;
    selectionState: SelectionState;
}) => void;
