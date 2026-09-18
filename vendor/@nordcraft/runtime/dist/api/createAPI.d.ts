import type { LegacyComponentAPI } from '@nordcraft/core/dist/api/apiTypes';
import type { Nullable } from '@nordcraft/core/dist/types';
import type { ComponentContext } from '../types';
export type ApiRequest = {
    url: string;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTION' | 'HEAD';
    auth: Nullable<{
        type: string;
    }>;
    headers: Record<string, string>;
    body: any;
};
/**
 * Set up an api for a component.
 * API requests are either proxied through toddle's back-end
 * or sent directly to the api endpoint (when api.proxy === false)
 */
export declare function createLegacyAPI(api: LegacyComponentAPI, ctx: ComponentContext): {
    fetch: (request?: ApiRequest | undefined) => Promise<unknown>;
    destroy: () => void | undefined;
};
