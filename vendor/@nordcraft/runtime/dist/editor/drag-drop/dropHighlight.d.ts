import type { Point } from '../types';
/**
 * Visual representation of where a dragged node will be dropped.
 */
export declare function setDropHighlight(element: HTMLElement, targetContainer: HTMLElement, color: string): void;
/**
 * Visual representation of where a dragged node will be dropped outside of its own container.
 */
export declare function setExternalDropHighlight({ layout, center, length, color, projectionPoint }: {
    layout: 'block' | 'inline';
    center: Point;
    length: number;
    color: string;
    projectionPoint: number;
}): void;
export declare function removeDropHighlight(): void;
