import { mapHeadersToObject } from '@nordcraft/core/dist/api/headers.js';
import { applyFormula, isToddleFormula, } from '@nordcraft/core/dist/formula/formula.js';
import { filterObject, mapValues } from '@nordcraft/core/dist/utils/collections.js';
import { isDefined } from '@nordcraft/core/dist/utils/util.js';
import * as libFormulas from '@nordcraft/std-lib/dist/formulas.js';
import { getPathSegments } from '../routing/routing.js';
import { getRequestCookies } from './cookies.js';
import { escapeSearchParameters } from './request.js';
/**
 * Builds a FormulaContext that can be used to evaluate formulas for a page component
 * It also initializes data->Variables with their initial values based on the FormulaContext
 */
export const getPageFormulaContext = ({ branchName, component, req, logErrors, files, }) => {
    const env = serverEnv({ req, branchName, logErrors });
    const { searchParamsWithDefaults, hash, combinedParams, url } = getParameters({ route: component?.route, req });
    const formulaContext = {
        data: {
            Location: {
                page: component?.page ?? '',
                path: url.pathname,
                params: combinedParams,
                query: searchParamsWithDefaults,
                hash,
            },
            Attributes: combinedParams,
            // Path and query parameters are referenced in a flat structure in formulas
            // hence, we need to merge them. We prefer path parameters over query parameters
            // in case of naming collisions
            'URL parameters': component?.route
                ? getDataUrlParameters({ route: component.route, req })
                : {},
            Apis: {},
        },
        component,
        root: null,
        package: undefined,
        env,
        toddle: getServerToddleObject(files),
    };
    formulaContext.data.Page = {
        Theme: component
            ? getThemeInitialValue(component, formulaContext, env)
            : null,
    };
    formulaContext.data.Variables = mapValues(filterObject(component?.variables ?? {}, ([_, variable]) => isDefined(variable)), ({ initialValue }) => {
        return applyFormula(initialValue, formulaContext);
    });
    // Re-apply theme after variables have been initialized to ensure it has access to any variables if needed
    formulaContext.data.Page = {
        Theme: component
            ? getThemeInitialValue(component, formulaContext, env)
            : null,
    };
    return formulaContext;
};
export const getServerToddleObject = (files) => {
    const coreFormulas = Object.fromEntries(Object.entries(libFormulas).map(([name, module]) => [
        '@toddle/' + name,
        module.default,
    ]));
    return {
        getFormula: (name) => coreFormulas[name],
        getCustomFormula: (name, packageName) => {
            let formula;
            if (isDefined(packageName)) {
                formula = files.packages?.[packageName]?.formulas?.[name];
            }
            else {
                formula = files.formulas?.[name];
            }
            if (formula && isToddleFormula(formula)) {
                return formula;
            }
        },
        errors: [],
    };
};
export const getDataUrlParameters = ({ route, req, }) => {
    const { searchParamsWithDefaults, combinedParams } = getParameters({
        route,
        req,
    });
    return {
        ...searchParamsWithDefaults,
        ...combinedParams,
    };
};
export const getParameters = ({ route, req, }) => {
    const url = new URL(req.url);
    const searchParams = [
        ...escapeSearchParameters(url.searchParams).entries(),
    ].reduce((params, [key, val]) => ({
        ...params,
        [key]: val ?? null,
    }), {});
    const pathSegments = getPathSegments(url);
    const pathParams = route?.path.reduce((prev, param, index) => {
        if (param.type === 'param') {
            if (isDefined(pathSegments[index]) &&
                typeof pathSegments[index] === 'string') {
                return { ...prev, [param.name]: pathSegments[index] };
            }
            else {
                // Explicitly set path parameters to null by default
                // to avoid undefined values when serializing for the runtime
                return { ...prev, [param.name]: null };
            }
        }
        return prev;
    }, {});
    // Explicitly set all query params to null by default
    // to avoid undefined values in the runtime
    const defaultQueryParams = Object.keys(route?.query ?? {}).reduce((params, key) => ({ ...params, [key]: null }), {});
    return {
        pathParams,
        searchParamsWithDefaults: { ...defaultQueryParams, ...searchParams },
        combinedParams: { ...searchParams, ...pathParams },
        hash: url.hash.slice(1),
        url,
    };
};
export const serverEnv = ({ branchName, req, logErrors, }) => ({
    branchName: branchName,
    // isServer will be true for SSR + proxied requests
    isServer: true,
    request: {
        headers: mapHeadersToObject(req.headers),
        cookies: getRequestCookies(req),
        url: req.url,
    },
    logErrors,
});
export const getThemeInitialValue = (component, formulaContext, env) => {
    const themeFormula = component.route.info?.theme?.formula;
    if (themeFormula) {
        return applyFormula(themeFormula, formulaContext);
    }
    else {
        // No theme set explicitly will default to system preference
        // Default theme (or initial value) is handled in CSS
        return env.request.cookies['nc-theme'] || null;
    }
};
//# sourceMappingURL=formulaContext.js.map