import type { ToddleRequestInit } from '@nordcraft/core/dist/api/apiTypes';
import type { ContextApi, ContextApiV2 } from '../types';
export declare const isContextApiV2: (api: ContextApi) => api is ContextApiV2;
export declare class ApiAbortHandler {
    private abortControllers;
    applyAbortSignal: (requestInit: ToddleRequestInit) => {
        body?: BodyInit | null | undefined;
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        window?: null | undefined;
        headers: Headers;
        signal: AbortSignal;
    };
    abort: () => void;
    private cleanupAbortedControllers;
}
