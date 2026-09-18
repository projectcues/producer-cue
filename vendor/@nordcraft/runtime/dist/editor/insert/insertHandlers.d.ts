import type { DragInsertState } from '../types';
export declare const handleInsertStarted: (messageData: {
    x: number;
    y: number;
}, highlightedNodeId: string | null, elementType: "div" | "text") => DragInsertState | null;
export declare const handleInsertMouseMove: (messageData: {
    x: number;
    y: number;
}, insertState: DragInsertState) => void;
export declare const handleInsertEnded: (messageData: {
    canceled?: boolean | undefined;
}, insertState: DragInsertState) => Promise<null>;
