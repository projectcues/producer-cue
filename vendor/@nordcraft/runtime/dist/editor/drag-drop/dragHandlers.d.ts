import type { Component } from '@nordcraft/core/dist/component/component.types';
import type { DragInsertState } from '../types';
export declare const handleDragStarted: (messageData: {
    x: number;
    y: number;
}, selectedNodeId: string | null, altKey: boolean) => DragInsertState | null;
export declare const handleDragMouseMove: (messageData: {
    x: number;
    y: number;
}, dragState: DragInsertState, metaKey: boolean) => void;
export declare const handleDragAltToggle: (asCopy: boolean, dragState: DragInsertState) => Promise<DragInsertState | null>;
export declare const handleDragEnded: (messageData: {
    canceled?: boolean | undefined;
}, dragState: DragInsertState, component: Component | null) => Promise<DragInsertState | null>;
