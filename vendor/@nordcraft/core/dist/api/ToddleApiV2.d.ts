import type { ActionModel } from '../component/component.types';
import { type Formula } from '../formula/formula';
import type { GlobalFormulas } from '../formula/formulaTypes';
import type { Nullable } from '../types';
import { type ApiRequest } from './apiTypes';
export declare class ToddleApiV2<Handler> implements ApiRequest {
    private api;
    private _apiReferences?;
    private key;
    private globalFormulas;
    constructor(api: ApiRequest, apiKey: string, globalFormulas: GlobalFormulas<Handler>);
    private get apiReferences();
    get version(): 2;
    get name(): string;
    get type(): "http" | "ws";
    get autoFetch(): Nullable<Formula>;
    get url(): Nullable<Formula>;
    get path(): Nullable<Record<string, {
        formula: Formula;
        index: number;
    }>>;
    get headers(): Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>;
    set headers(headers: Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>);
    get method(): Nullable<import("./apiTypes").ApiMethod>;
    get body(): Nullable<Formula>;
    get inputs(): Record<string, {
        formula?: Nullable<Formula>;
    }>;
    get queryParams(): Nullable<Record<string, {
        formula: Formula;
        enabled?: Nullable<Formula>;
    }>>;
    get server(): Nullable<{
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
    get client(): Nullable<{
        debounce?: Nullable<{
            formula: Formula;
        }>;
        onCompleted?: Nullable<import("../component/component.types").EventModel>;
        onFailed?: Nullable<import("../component/component.types").EventModel>;
        onMessage?: Nullable<import("../component/component.types").EventModel>;
        parserMode?: Nullable<import("./apiTypes").ApiParserMode>;
        credentials?: Nullable<"include" | "omit" | "same-origin">;
    }>;
    get redirectRules(): Nullable<Record<string, {
        formula: Formula;
        statusCode?: Nullable<Formula>;
        index: number;
    }>>;
    get isError(): Nullable<{
        formula: Formula;
    }>;
    get timeout(): Nullable<{
        formula: Formula;
    }>;
    get '@nordcraft/metadata'(): Nullable<{
        comments?: Nullable<Partial<Record<string, import("../types").Comment & {
            index: number;
        }>>>;
    }>;
    get dependsOn(): string[];
    formulasInApi(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
    actionModelsInApi(): Generator<[(string | number)[], ActionModel]>;
}
