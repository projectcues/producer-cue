import { applyFormula, } from './formula';
export const applyRecordFormula = (formula, ctx) => {
    return Object.fromEntries((formula.entries ?? []).map((entry, i) => [
        entry.name,
        applyFormula(entry.formula, ctx, ['entries', i, 'formula']),
    ]));
};
//# sourceMappingURL=recordFormula.js.map