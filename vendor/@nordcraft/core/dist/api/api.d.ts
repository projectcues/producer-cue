import type { Formula, FormulaContext } from '../formula/formula';
import type { Nullable } from '../types';
import type { ApiBase, ApiPerformance, ApiRequest, ComponentAPI, LegacyComponentAPI, ToddleRequestInit } from './apiTypes';
import { ApiMethod } from './apiTypes';
import type { LegacyToddleApi } from './LegacyToddleApi';
import type { ToddleApiV2 } from './ToddleApiV2';
export declare const NON_BODY_RESPONSE_CODES: number[];
export declare const isLegacyApi: <Handler>(api: LegacyToddleApi<Handler> | ToddleApiV2<Handler> | ComponentAPI) => api is LegacyComponentAPI | LegacyToddleApi<Handler>;
export declare const createApiRequest: <Handler>({ api, formulaContext, baseUrl, defaultHeaders, }: {
    api: ApiRequest | ToddleApiV2<Handler>;
    formulaContext: FormulaContext;
    baseUrl?: Nullable<string>;
    defaultHeaders: Headers | undefined;
}) => {
    url: URL;
    requestSettings: ToddleRequestInit;
};
export declare const getUrl: (api: ApiBase, formulaContext: FormulaContext, baseUrl?: Nullable<string>) => URL;
export declare const HttpMethodsWithAllowedBody: ApiMethod[];
export declare const applyAbortSignal: (api: ApiRequest, requestSettings: RequestInit, formulaContext: FormulaContext) => void;
export declare const getRequestPath: (path: Nullable<Record<string, {
    formula: Formula;
    index: number;
}>>, formulaContext: FormulaContext) => string;
export declare const getRequestQueryParams: (params: Nullable<Record<string, {
    formula: Formula;
    enabled?: Nullable<Formula>;
}>>, formulaContext: FormulaContext) => URLSearchParams;
export declare const getRequestHeaders: ({ apiHeaders, formulaContext, defaultHeaders, }: {
    apiHeaders: Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>;
    formulaContext: FormulaContext;
    defaultHeaders: Headers | undefined;
}) => Headers;
export declare const getBaseUrl: ({ origin, url, }: {
    origin: string;
    url?: Nullable<string>;
}) => string;
/**
 * Calculate the hash of a Request object based on its properties
 */
export declare const requestHash: (url: URL, request: RequestInit) => number;
export declare const isApiError: ({ apiName, response, formulaContext, errorFormula, performance, }: {
    apiName: string;
    response: {
        ok: boolean;
        status?: Nullable<number>;
        headers?: Nullable<Record<string, string>>;
        body: unknown;
    };
    formulaContext: FormulaContext;
    performance: ApiPerformance;
    errorFormula?: Nullable<{
        formula: Formula;
    }>;
}) => boolean;
export declare const getRequestBody: ({ api, formulaContext, headers, method, }: {
    api: ApiRequest;
    formulaContext: FormulaContext;
    headers: Headers;
    method: ApiMethod;
}) => string | FormData | undefined;
/**
 * Converts a plain object to FormData, supporting nested objects and arrays.
 */
export declare const toFormData: (body: Record<string, unknown>) => FormData;
export declare const createApiEvent: (eventName: "failed" | "message" | "success", detail: any) => CustomEvent<any>;
