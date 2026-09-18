import type { Formula } from './formula';
import type { GlobalFormulas } from './formulaTypes';
export declare class ToddleFormula<Handler> {
    private formula;
    private globalFormulas;
    constructor({ formula, globalFormulas }: {
        formula: Formula;
        globalFormulas: GlobalFormulas<Handler>;
    });
    /**
     * Traverse all formulas in the formula.
     * @returns An iterable that yields the path and formula.
     */
    formulasInFormula(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
}
