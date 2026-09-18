import { measure } from '../utils/measure';
import { isDefined } from '../utils/util';
import { applyFormula, isToddleFormula, } from './formula';
export const applyFunctionFormula = (formula, ctx) => {
    const stopMeasure = measure(`Formula: ${formula.name}`, {
        formula,
        component: ctx.component?.name,
    });
    const packageName = formula.package ?? ctx.package ?? undefined;
    const newFunc = (ctx.toddle ??
        globalThis.toddle)?.getCustomFormula(formula.name, packageName);
    if (isDefined(newFunc)) {
        ctx.package = packageName;
        const args = (formula.arguments ?? []).reduce((args, arg, i) => ({
            ...args,
            [arg.name ?? `${i}`]: arg.isFunction
                ? (Args) => applyFormula(arg.formula, {
                    ...ctx,
                    data: {
                        ...ctx.data,
                        Args: ctx.data.Args
                            ? { ...Args, '@toddle.parent': ctx.data.Args }
                            : Args,
                    },
                }, ['arguments', i])
                : applyFormula(arg.formula, ctx, ['arguments', i]),
        }), {});
        try {
            if (isToddleFormula(newFunc)) {
                return applyFormula(newFunc.formula, {
                    ...ctx,
                    data: { ...ctx.data, Args: args },
                }, ['formula']);
            }
            else {
                return newFunc.handler(args, {
                    root: ctx.root ?? document,
                    env: ctx.env,
                });
            }
        }
        catch (e) {
            ctx.toddle.errors.push(e);
            if (ctx.env?.logErrors) {
                console.error(e);
            }
            return null;
        }
        finally {
            stopMeasure();
        }
    }
    else {
        // Lookup legacy formula
        const legacyFunc = (ctx.toddle ?? globalThis.toddle).getFormula(formula.name);
        if (typeof legacyFunc === 'function') {
            const args = (formula.arguments ?? []).map((arg, i) => arg.isFunction
                ? (Args) => applyFormula(arg.formula, {
                    ...ctx,
                    data: {
                        ...ctx.data,
                        Args: ctx.data.Args
                            ? { ...Args, '@toddle.parent': ctx.data.Args }
                            : Args,
                    },
                }, ['arguments', i])
                : applyFormula(arg.formula, ctx, ['arguments', i]));
            try {
                return legacyFunc(args, ctx);
            }
            catch (e) {
                ctx.toddle.errors.push(e);
                if (ctx.env?.logErrors) {
                    console.error(e);
                }
                return null;
            }
            finally {
                stopMeasure();
            }
        }
    }
    if (ctx.env?.logErrors) {
        console.error(`Could not find formula ${formula.name} in package ${packageName ?? ''}`, formula);
    }
    return null;
};
//# sourceMappingURL=functionFormula.js.map