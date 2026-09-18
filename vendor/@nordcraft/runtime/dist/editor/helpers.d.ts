import type { DragInsertState, Point } from './types';
export declare const DRAG_MOVE_CLASSNAME = "__drag-mode--move";
export declare function isVoidElement(element: Element): boolean;
/**
 * Return the most likely permutation to move the dragged element to based on the current drag position.
 * The calculation is based on distance from the center of the dragged element to the center of the potential target element,
 * but only if the dragged element is overlapping with the target element.
 */
export declare function getBestPermutation(element: HTMLElement, reorderPermutations: Array<{
    nextSibling: Node | null;
    rect: DOMRect;
}>): {
    rect: DOMRect;
    nextSibling: Node | null;
} | null;
export declare function dragInsertStarted({ action, element, lastCursorPosition, repeatedNodes, asCopy, initialContainer, initialNextSibling }: {
    action: 'drag' | 'insert';
    element: HTMLElement;
    lastCursorPosition: Point;
    repeatedNodes: HTMLElement[];
    asCopy: boolean;
    initialContainer?: HTMLElement;
    initialNextSibling?: Element | null;
}): DragInsertState;
export declare function dragInsertEnded(dragInsertState: DragInsertState, canceled: boolean): Promise<void>;
export declare function dragInsertMove(action: 'drag' | 'insert', dragInsertState: DragInsertState | null, exclude: HTMLElement[]): void;
