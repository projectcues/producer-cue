import type { ComponentData, SupportedNamespaces } from '@nordcraft/core/dist/component/component.types';
import type { Signal } from '../signal/signal';
import type { ComponentContext } from '../types';
export declare function createNode({ id, dataSignal, path, ctx, namespace, parentElement, instance, slotRepeatIndex }: {
    id: string;
    dataSignal: Signal<ComponentData>;
    path: string;
    ctx: ComponentContext;
    namespace?: SupportedNamespaces;
    parentElement: Element | ShadowRoot;
    instance: Record<string, string>;
    slotRepeatIndex?: number;
}): ReadonlyArray<Element | Text>;
export type NodeRenderer<NodeType> = {
    node: NodeType;
    dataSignal: Signal<ComponentData>;
    id: string;
    path: string;
    ctx: ComponentContext;
    namespace?: SupportedNamespaces;
    parentElement: Element | ShadowRoot;
    instance: Record<string, string>;
    /**
     * Slots can be located inside repeated nodes, so we need to forward their last repeat index to ensure unique paths for their children.
     * Note that the repeat index is reset at slot and component boundaries
     */
    slotRepeatIndex?: number;
};
