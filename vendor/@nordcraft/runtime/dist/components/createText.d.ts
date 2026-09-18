import type { ComponentData, SupportedNamespaces, TextNodeModel } from '@nordcraft/core/dist/component/component.types';
import type { Signal } from '../signal/signal';
import type { ComponentContext } from '../types';
export type RenderTextProps = {
    node: TextNodeModel;
    dataSignal: Signal<ComponentData>;
    id: string;
    path: string;
    namespace?: SupportedNamespaces;
    ctx: ComponentContext;
};
/**
 * Create a text node
 *
 * Note: We wrap the text in a <span> to make it easier to select/highlight the text node in the preview.
 * We should find a better way to do this without wrapping the node, and instead use `createTextNode`.
 */
export declare function createText({ node, id, path, dataSignal, namespace, ctx }: RenderTextProps): HTMLSpanElement | Text;
/**
 * This function is technically more performant than `createText` because it doesn't create a wrapping <span> element.
 * We would like to use this everywhere eventually, but we need to handle raw text selection in the editor (possibly by utilizing text ranges).
 */
export declare function createTextNS({ node, dataSignal, ctx }: Pick<RenderTextProps, 'node' | 'dataSignal' | 'ctx'>): Text;
