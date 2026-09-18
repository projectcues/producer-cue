import type { ComponentData, ComponentNodeModel, SupportedNamespaces } from '@nordcraft/core/dist/component/component.types';
import type { Signal } from '../signal/signal';
import type { ComponentContext } from '../types';
export type RenderComponentNodeProps = {
    path: string;
    node: ComponentNodeModel;
    dataSignal: Signal<ComponentData>;
    ctx: ComponentContext;
    parentElement: Element | ShadowRoot;
    instance: Record<string, string>;
    namespace?: SupportedNamespaces;
};
export declare function createComponent({ node, path, dataSignal, ctx, parentElement, instance, namespace }: RenderComponentNodeProps): ReadonlyArray<Element | Text>;
