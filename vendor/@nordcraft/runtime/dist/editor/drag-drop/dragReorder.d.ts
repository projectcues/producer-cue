import type { DragInsertState } from '../types';
export declare const DRAG_REORDER_CLASSNAME = "__drag-mode--reorder";
export declare function dragReorder(dragState: DragInsertState | null): Promise<void>;
