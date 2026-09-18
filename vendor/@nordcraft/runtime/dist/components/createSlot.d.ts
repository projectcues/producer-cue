import type { SlotNodeModel } from '@nordcraft/core/dist/component/component.types';
import type { NodeRenderer } from './createNode';
export declare function createSlot({ path, node, dataSignal, ctx, parentElement, instance, namespace, slotRepeatIndex }: NodeRenderer<SlotNodeModel>): ReadonlyArray<Element | Text>;
