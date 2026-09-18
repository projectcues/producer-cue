import { toBoolean } from '../utils/util';
import { applyFormula } from './formula';
export const applyOrFormula = (formula, ctx) => {
    for (let i = 0; i < (formula.arguments ?? []).length; i++) {
        const arg = (formula.arguments ?? [])[i];
        if (toBoolean(applyFormula(arg?.formula, ctx, ['arguments', i, 'formula']))) {
            return true;
        }
    }
    return false;
};
export const applyEvaluateAllOrFormula = (formula, ctx) => {
    let orResult = false;
    for (let i = 0; i < (formula.arguments ?? []).length; i++) {
        const arg = (formula.arguments ?? [])[i];
        const argResult = applyFormula(arg?.formula, ctx, [
            'arguments',
            i,
            'formula',
        ]);
        if (toBoolean(argResult)) {
            orResult = true;
        }
    }
    return orResult;
};
//# sourceMappingURL=orFormula.js.map