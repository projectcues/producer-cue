import type { PluginFormula } from '@nordcraft/core/dist/formula/formulaTypes';
import type { FormulaHandlerV2, PluginActionV2 } from '@nordcraft/core/dist/types';
export declare const initGlobalObject: (code?: {
    formulas: Record<string, Record<string, PluginFormula<FormulaHandlerV2>>>;
    actions: Record<string, Record<string, PluginActionV2>>;
} | undefined) => void;
export declare const createRoot: (domNode: HTMLElement) => void;
