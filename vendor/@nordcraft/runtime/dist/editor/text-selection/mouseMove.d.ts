import type { PointerState, SelectionState } from '../types';
export declare const handleTextMouseMove: ({ node, x, y, buttons, pointerState, selectionState, }: {
    node: HTMLElement;
    x: number;
    y: number;
    buttons: number;
    pointerState: PointerState;
    selectionState: SelectionState;
}) => boolean;
