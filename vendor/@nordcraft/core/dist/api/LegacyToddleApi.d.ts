import { type Formula } from '../formula/formula';
import type { GlobalFormulas } from '../formula/formulaTypes';
import type { Nullable } from '../types';
import { type LegacyComponentAPI } from './apiTypes';
export declare class LegacyToddleApi<Handler> {
    private api;
    private key;
    private globalFormulas;
    private _apiReferences?;
    constructor(api: LegacyComponentAPI, key: string, globalFormulas: GlobalFormulas<Handler>);
    get apiReferences(): Set<string>;
    get name(): string;
    get type(): "REST";
    get autoFetch(): Nullable<Formula>;
    get url(): Nullable<Formula>;
    get path(): Nullable<{
        formula: Formula;
    }[]>;
    get proxy(): Nullable<boolean>;
    get queryParams(): Nullable<Record<string, {
        name: string;
        formula: Formula;
    }>>;
    get headers(): Nullable<Record<string, Formula> | Formula>;
    get method(): Nullable<"DELETE" | "GET" | "POST" | "PUT">;
    get body(): Nullable<Formula>;
    get auth(): Nullable<{
        type: "Bearer access_token" | "Bearer id_token";
    }>;
    get throttle(): Nullable<number>;
    get debounce(): Nullable<number>;
    get onCompleted(): Nullable<import("../component/component.types").EventModel>;
    get onFailed(): Nullable<import("../component/component.types").EventModel>;
    get dependsOn(): string[] | undefined;
    formulasInApi(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
}
