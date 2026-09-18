/* eslint-disable no-console */
import { measure } from '../utils/measure.js';
import { applyFormula, } from './formula.js';
export const applyApplyFormula = (formula, ctx) => {
    const componentFormula = ctx.component?.formulas?.[formula.name];
    if (!componentFormula) {
        if (ctx.env?.logErrors) {
            console.log('Component does not have a formula with the name ', formula.name);
        }
        return null;
    }
    const stopMeasure = measure(`Formula: ${componentFormula.name}`, {
        formula,
        component: ctx.component?.name,
    });
    const Input = Object.fromEntries((formula.arguments ?? []).map((arg, i) => arg.isFunction
        ? [
            arg.name,
            (Args) => applyFormula(arg.formula, {
                ...ctx,
                data: {
                    ...ctx.data,
                    Args: ctx.data.Args
                        ? { ...Args, '@toddle.parent': ctx.data.Args }
                        : Args,
                },
            }, ['arguments', i]),
        ]
        : [arg.name, applyFormula(arg.formula, ctx, ['arguments', i])]));
    const data = {
        ...ctx.data,
        Args: ctx.data.Args ? { ...Input, '@toddle.parent': ctx.data.Args } : Input,
    };
    const cache = ctx.formulaCache?.[formula.name]?.get(data);
    if (cache?.hit) {
        stopMeasure({ cache: 'hit' });
        return cache.data;
    }
    else {
        const result = applyFormula(componentFormula.formula, {
            ...ctx,
            data,
        }, ['formula']);
        ctx.formulaCache?.[formula.name]?.set(data, result);
        stopMeasure({ cache: 'miss' });
        return result;
    }
};
//# sourceMappingURL=applyFormula.js.map