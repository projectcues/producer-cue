import type { ElementNodeModel } from '@nordcraft/core/dist/component/component.types';
import type { NodeRenderer } from './createNode';
export declare function createElement({ node, dataSignal, id, path, ctx, namespace, instance, slotRepeatIndex }: NodeRenderer<ElementNodeModel>): Element;
