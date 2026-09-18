import type { LegacyPluginAction, Nullable, PluginActionV2 } from '../types';
import type { ActionModel } from './component.types';
export declare function getActionsInAction(action: Nullable<ActionModel>, path?: (string | number)[]): Generator<[(string | number)[], ActionModel]>;
export declare const isLegacyPluginAction: (action: LegacyPluginAction | PluginActionV2) => action is LegacyPluginAction;
