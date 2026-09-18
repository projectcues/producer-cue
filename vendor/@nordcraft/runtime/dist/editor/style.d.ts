import type { Component, NodeStyleModel } from '@nordcraft/core/dist/component/component.types';
export declare const SIZE_PROPERTIES: Set<string>;
export declare const insertStyles: (parent: HTMLElement, root: Component, components: Component[]) => void;
export declare const styleToCss: (style: NodeStyleModel) => string;
/**
 * Converts viewport units (vh) to emulated viewport units so the canvas can override
 * the viewport size independent from the canvas iframe size.
 */
export declare const convertViewportUnitsToEmulatedViewportUnits: (value: string | number | undefined) => string | undefined;
