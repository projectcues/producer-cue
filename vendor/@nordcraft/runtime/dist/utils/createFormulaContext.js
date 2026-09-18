/**
 * For performance reasons, we should avoid this function being called too often,
 * and instead pass the ctx directly and the data as a separate argument to functions,
 * instead of destructuring and constructing over and over.
 *
 * The overhead per request is small, but if done once per formula evaluation, the
 * direct overhead can be significant, and the indirect overhead of creating new objects
 * and garbage collection can be significant as well.
 */
export function createFormulaContext(ctx, data, options) {
    const formulaContext = {
        data,
        component: ctx.component,
        formulaCache: ctx.formulaCache,
        root: ctx.root,
        package: ctx.package,
        toddle: ctx.toddle,
        env: ctx.env,
        jsonPath: options?.jsonPath ?? ctx.jsonPath,
    };
    if (options?.includeReportFormulaEvaluation !== false) {
        formulaContext.reportFormulaEvaluation = ctx.reportFormulaEvaluation;
    }
    return formulaContext;
}
//# sourceMappingURL=createFormulaContext.js.map