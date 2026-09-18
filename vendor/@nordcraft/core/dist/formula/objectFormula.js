import { applyFormula, } from './formula';
export const applyObjectFormula = (formula, ctx) => {
    return Object.fromEntries(formula.arguments?.map((entry, i) => [
        entry.name,
        applyFormula(entry.formula, ctx, ['arguments', i, 'formula']),
    ]) ?? []);
};
//# sourceMappingURL=objectFormula.js.map