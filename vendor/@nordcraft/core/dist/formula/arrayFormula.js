import { applyFormula, } from './formula.js';
export const applyArrayFormula = (formula, ctx) => {
    return (formula.arguments ?? []).map((entry, i) => applyFormula(entry.formula, ctx, ['arguments', i, 'formula']));
};
//# sourceMappingURL=arrayFormula.js.map