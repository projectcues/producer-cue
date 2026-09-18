import type { ApiStatus, ComponentAPI, LegacyApiStatus } from '@nordcraft/core/dist/api/apiTypes';
import type { Component } from '@nordcraft/core/dist/component/component.types';
import type { FormulaContext } from '@nordcraft/core/dist/formula/formula';
import type { Nullable } from '@nordcraft/core/dist/types';
import type { ProjectFiles } from '../ssr.types';
export type ApiCache = Record<string, ApiStatus>;
export type ApiEvaluator = (args: {
    component: Component;
    formulaContext: FormulaContext;
    req: Request;
    apiCache: ApiCache;
    updateApiCache: (key: string, value: ApiStatus) => void;
}) => Promise<Record<string, LegacyApiStatus | (ApiStatus & {
    inputs?: Record<string, unknown>;
})>>;
export declare const sortApiEntries: (apis: [string, Nullable<ComponentAPI>][]) => [string, Nullable<ComponentAPI>][];
export declare const processComponentApis: <T extends Component>(component: T, files: ProjectFiles) => T;
