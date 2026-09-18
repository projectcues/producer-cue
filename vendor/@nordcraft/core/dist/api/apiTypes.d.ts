import type { EventModel } from '../component/component.types';
import type { Formula } from '../formula/formula';
import type { NordcraftMetadata, Nullable } from '../types';
export type ComponentAPI = LegacyComponentAPI | ApiRequest;
export interface LegacyComponentAPI {
    name: string;
    type: 'REST';
    autoFetch?: Nullable<Formula>;
    url?: Nullable<Formula>;
    path?: Nullable<{
        formula: Formula;
    }[]>;
    proxy?: Nullable<boolean>;
    queryParams?: Nullable<Record<string, {
        name: string;
        formula: Formula;
    }>>;
    headers?: Nullable<Record<string, Formula> | Formula>;
    method?: Nullable<'GET' | 'POST' | 'DELETE' | 'PUT'>;
    body?: Nullable<Formula>;
    auth?: Nullable<{
        type: 'Bearer id_token' | 'Bearer access_token';
    }>;
    throttle?: Nullable<number>;
    debounce?: Nullable<number>;
    onCompleted?: Nullable<EventModel>;
    onFailed?: Nullable<EventModel>;
    version?: never;
    dependsOn?: string[];
}
export interface LegacyApiStatus {
    data: unknown;
    isLoading: boolean;
    error: unknown;
    response?: never;
}
export declare enum ApiMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS"
}
export declare const REDIRECT_STATUS_CODES: readonly [300, 301, 302, 303, 304, 307, 308];
export type RedirectStatusCode = (typeof REDIRECT_STATUS_CODES)[number];
export type ApiParserMode = 'auto' | 'text' | 'json' | 'event-stream' | 'json-stream' | 'blob';
export interface ApiBase extends NordcraftMetadata {
    url?: Nullable<Formula>;
    path?: Nullable<Record<string, {
        formula: Formula;
        index: number;
    }>>;
    queryParams?: Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>;
    hash?: Nullable<{
        formula: Formula;
    }>;
}
export interface ApiRequest extends ApiBase {
    version: 2;
    name: string;
    type: 'http' | 'ws';
    autoFetch?: Nullable<Formula>;
    headers?: Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>;
    method?: Nullable<ApiMethod>;
    body?: Nullable<Formula>;
    inputs: Record<string, {
        formula?: Nullable<Formula>;
    }>;
    service?: Nullable<string>;
    servicePath?: Nullable<string>;
    server?: Nullable<{
        proxy?: Nullable<{
            enabled: {
                formula: Formula;
            };
            useTemplatesInBody?: Nullable<{
                formula: Formula;
            }>;
        }>;
        ssr?: Nullable<{
            enabled?: Nullable<{
                formula: Formula;
            }>;
        }>;
    }>;
    client?: Nullable<{
        debounce?: Nullable<{
            formula: Formula;
        }>;
        onCompleted?: Nullable<EventModel>;
        onFailed?: Nullable<EventModel>;
        onMessage?: Nullable<EventModel>;
        parserMode?: Nullable<ApiParserMode>;
        credentials?: Nullable<'include' | 'same-origin' | 'omit'>;
    }>;
    redirectRules?: Nullable<Record<string, {
        formula: Formula;
        statusCode?: Nullable<Formula>;
        index: number;
    }>>;
    isError?: Nullable<{
        formula: Formula;
    }>;
    timeout?: Nullable<{
        formula: Formula;
    }>;
    dependsOn?: string[];
}
export interface ApiStatus {
    data: unknown;
    isLoading: boolean;
    error: unknown;
    response?: Nullable<{
        status?: Nullable<number>;
        headers?: Nullable<Record<string, string>>;
        performance?: Nullable<ApiPerformance>;
        debug?: Nullable<unknown>;
    }>;
}
export interface ApiPerformance {
    requestStart?: Nullable<number>;
    responseStart?: Nullable<number>;
    responseEnd?: Nullable<number>;
}
export interface ToddleRequestInit extends RequestInit {
    headers: Headers;
}
