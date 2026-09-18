import { applyFormula, isFormula, } from '@nordcraft/core/dist/formula/formula';
export const evaluateResponseHeaders = ({ formulaContext, responseHeaders, }) => {
    if (!responseHeaders) {
        return {};
    }
    const evaluatedHeaders = {};
    for (const [headerName, headerValue] of Object.entries(responseHeaders)) {
        if (typeof headerValue !== 'string' && !isFormula(headerValue)) {
            continue;
        }
        const formulaValue = applyFormula(headerValue, formulaContext);
        if (typeof formulaValue === 'string') {
            evaluatedHeaders[headerName] = formulaValue;
        }
    }
    return evaluatedHeaders;
};
//# sourceMappingURL=response.js.map