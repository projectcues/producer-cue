import { getFormulasInFormula } from './formulaUtils';
export class ToddleFormula {
    formula;
    globalFormulas;
    constructor({ formula, globalFormulas, }) {
        this.formula = formula;
        this.globalFormulas = globalFormulas;
    }
    /**
     * Traverse all formulas in the formula.
     * @returns An iterable that yields the path and formula.
     */
    *formulasInFormula() {
        yield* getFormulasInFormula({
            formula: this.formula,
            globalFormulas: this.globalFormulas,
        });
    }
}
//# sourceMappingURL=ToddleFormula.js.map