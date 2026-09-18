import type { ApiRequest } from '@nordcraft/core/dist/api/apiTypes';
import type { ComponentData } from '@nordcraft/core/dist/component/component.types';
import type { ComponentContext, ContextApiV2 } from '../types';
/**
 * Set up an api v2 for a component.
 */
export declare function createAPI({ apiRequest, componentData: initialComponentData, ctx }: {
    apiRequest: ApiRequest;
    componentData: ComponentData;
    ctx: ComponentContext;
}): ContextApiV2;
