import { type ApiRequest } from '@nordcraft/core/dist/api/apiTypes';
import type { FormulaContext } from '@nordcraft/core/dist/formula/formula';
/**
 * Run an introspection query for an existing API
 * The introspection will usually be a POST request, but we use the method
 * from the original API to support other methods.
 */
export declare const introspectApiRequest: ({ api, componentName, formulaContext, }: {
    api: ApiRequest;
    componentName: string;
    formulaContext: FormulaContext;
}) => Promise<any>;
