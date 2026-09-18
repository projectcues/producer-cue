import type { ActionModel, ComponentData } from '@nordcraft/core/dist/component/component.types';
import type { ComponentContext } from '../types';
export declare function handleAction(action: ActionModel, data: ComponentData, ctx: ComponentContext, event?: Event, workflowCallback?: (event: string, data: unknown) => void): void | Promise<void> | Promise<() => void> | (() => void) | null;
