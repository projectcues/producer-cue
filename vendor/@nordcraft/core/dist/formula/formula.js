import { isDefined } from '../utils/util.js';
import { applyAndFormula, applyEvaluateAllAndFormula } from './andFormula.js';
import { applyApplyFormula } from './applyFormula.js';
import { applyArrayFormula } from './arrayFormula.js';
import {} from './formulaTypes.js';
import { applyFunctionFormula } from './functionFormula.js';
import { applyObjectFormula } from './objectFormula.js';
import { applyEvaluateAllOrFormula, applyOrFormula } from './orFormula.js';
import { applyPathFormula } from './pathFormula.js';
import { applyRecordFormula } from './recordFormula.js';
import { applyEvaluateAllSwitchFormula, applySwitchFormula, } from './switchFormula.js';
// As we are evaluating all branches of "if", "or" & "and" formulas when reportFormulaEvaluation is provided,
// we need to limit the depth to infinite loops as exit conditions are no longer used in recursive formulas.
const MAX_REPORT_DEPTH = 64;
export function isFormula(f) {
    return (f &&
        typeof f === 'object' &&
        typeof f.type === 'string' &&
        [
            'path',
            'function',
            'record',
            'object',
            'array',
            'or',
            'and',
            'apply',
            'value',
            'switch',
        ].includes(f.type));
}
export function isFormulaApplyOperation(formula) {
    return formula.type === 'apply';
}
export const isToddleFormula = (formula) => Object.hasOwn(formula, 'formula') &&
    isDefined(formula.formula);
export function applyFormula(formula, ctx, extendedPath) {
    // Short-circuit when not reporting to avoid unnecessary overhead of creating new objects and function
    if (!ctx.reportFormulaEvaluation) {
        if (!isFormula(formula)) {
            return formula;
        }
        try {
            switch (formula.type) {
                case 'value':
                    return formula.value;
                case 'path':
                    return applyPathFormula(formula, ctx.data);
                case 'switch':
                    return applySwitchFormula(formula, ctx);
                case 'or':
                    return applyOrFormula(formula, ctx);
                case 'and':
                    return applyAndFormula(formula, ctx);
                case 'object':
                    return applyObjectFormula(formula, ctx);
                case 'record':
                    return applyRecordFormula(formula, ctx);
                case 'array':
                    return applyArrayFormula(formula, ctx);
                case 'function':
                    return applyFunctionFormula(formula, ctx);
                case 'apply':
                    return applyApplyFormula(formula, ctx);
                default:
                    if (ctx.env?.logErrors) {
                        console.error('Could not recognize formula', formula);
                    }
            }
        }
        catch (e) {
            if (ctx.env?.logErrors) {
                console.error(e);
            }
            return null;
        }
        return undefined;
    }
    const jsonPath = [...(ctx.jsonPath ?? []), ...(extendedPath ?? [])];
    const _ctx = { ...ctx, jsonPath };
    const report = (value, p = jsonPath) => {
        ctx.reportFormulaEvaluation?.(p, value, _ctx);
        return value;
    };
    if (!isFormula(formula)) {
        return report(formula);
    }
    try {
        switch (formula.type) {
            case 'value': {
                return report(formula.value);
            }
            case 'path': {
                return report(applyPathFormula(formula, _ctx.data));
            }
            case 'switch': {
                if (_ctx.reportFormulaEvaluation &&
                    _ctx.jsonPath.length < MAX_REPORT_DEPTH) {
                    return report(applyEvaluateAllSwitchFormula(formula, _ctx));
                }
                return applySwitchFormula(formula, _ctx);
            }
            case 'or': {
                if (_ctx.reportFormulaEvaluation &&
                    _ctx.jsonPath.length < MAX_REPORT_DEPTH) {
                    return report(applyEvaluateAllOrFormula(formula, _ctx));
                }
                return applyOrFormula(formula, _ctx);
            }
            case 'and': {
                if (_ctx.reportFormulaEvaluation &&
                    _ctx.jsonPath.length < MAX_REPORT_DEPTH) {
                    return report(applyEvaluateAllAndFormula(formula, _ctx));
                }
                return applyAndFormula(formula, _ctx);
            }
            case 'object': {
                return report(applyObjectFormula(formula, _ctx));
            }
            case 'record': {
                // object used to be called record, there are still examples in the wild.
                return report(applyRecordFormula(formula, _ctx));
            }
            case 'array': {
                return report(applyArrayFormula(formula, _ctx));
            }
            case 'function': {
                return report(applyFunctionFormula(formula, _ctx));
            }
            case 'apply': {
                return report(applyApplyFormula(formula, _ctx));
            }
            default:
                if (_ctx.env?.logErrors) {
                    console.error('Could not recognize formula', formula);
                }
        }
    }
    catch (e) {
        if (_ctx.env?.logErrors) {
            console.error(e);
        }
        return report(null);
    }
    return report(undefined);
}
//# sourceMappingURL=formula.js.map