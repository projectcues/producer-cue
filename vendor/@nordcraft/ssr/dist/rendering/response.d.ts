import type { ResponseHeaders } from '@nordcraft/core/dist/component/component.types';
import { type FormulaContext } from '@nordcraft/core/dist/formula/formula';
import type { Nullable } from '@nordcraft/core/dist/types';
export declare const evaluateResponseHeaders: ({ formulaContext, responseHeaders, }: {
    formulaContext: FormulaContext;
    responseHeaders: Nullable<Partial<ResponseHeaders>>;
}) => Record<string, string>;
