import { getUrl } from '@nordcraft/core/dist/api/api';
import { applyFormula } from '@nordcraft/core/dist/formula/formula';
import { filterObject } from '@nordcraft/core/dist/utils/collections';
import { isDefined, toBoolean } from '@nordcraft/core/dist/utils/util';
import { getParameters } from '../rendering/formulaContext';
export const matchPageForUrl = ({ url, pages, }) => matchRoutes({
    url,
    entries: Object.fromEntries(pages.map((p) => [p.name, p])),
    getRoute: (page) => page.route,
});
export const matchRouteForUrl = ({ env, req, routes, serverContext, url, }) => {
    const enabledRoutes = filterObject(routes ?? {}, ([_name, route]) => {
        if (!isDefined(route.enabled)) {
            // If the route does not have an explicit enabled property, we assume it is enabled
            return true;
        }
        // Only include routes that are enabled
        const formulaContext = getRouteFormulaContext({
            env,
            req,
            route,
            serverContext,
        });
        return toBoolean(applyFormula(route.enabled.formula, formulaContext));
    });
    return matchRoutes({
        url,
        entries: enabledRoutes,
        getRoute: (route) => route.source,
    });
};
export const matchRoutes = ({ url, entries, getRoute, }) => {
    const pathSegments = getPathSegments(url);
    // E.g. /fruit/:fruitId => 1.2
    // E.g. /:blog/:slug/:author => 2.2.2
    // E.g. /:dynamic/static => 2.1
    const getPathHash = (path) => path.map((segment) => (segment.type === 'static' ? '1' : '2')).join('.');
    const matches = Object.entries(entries)
        .filter(([_, entry]) => {
        const route = getRoute(entry);
        return (pathSegments.length <= route.path.length &&
            route.path.every((segment, index) => segment.type === 'param' ||
                segment.optional === true ||
                segment.name === pathSegments[index]));
    })
        .sort(([_keyA, a], [_keyB, b]) => {
        const routeAHash = getPathHash(getRoute(a).path);
        const routeBHash = getPathHash(getRoute(b).path);
        // Favors static segments over dynamic segments and shorter paths over longer paths
        // E.g. /fruit/:fruitId wins over /:blog/:slug for /fruit/apple
        // E.g. /fruit/:fruitId/:category wins over /:blog/:slug for /fruit/apple
        return routeAHash.localeCompare(routeBHash);
    });
    const bestMatch = matches[0];
    if (!isDefined(bestMatch)) {
        return;
    }
    return { name: bestMatch[0], route: bestMatch[1] };
};
export const getRouteDestination = ({ serverContext, req, route, env, }) => {
    try {
        const requestUrl = new URL(req.url);
        const formulaContext = getRouteFormulaContext({
            env,
            req,
            route,
            serverContext,
        });
        const url = getUrl(route.destination, formulaContext, requestUrl.origin);
        if (route.type === 'redirect' &&
            requestUrl.origin === url.origin &&
            requestUrl.pathname === url.pathname) {
            // Redirects are not allowed to redirect to the same URL as their source
            return;
        }
        return url;
        // eslint-disable-next-line no-empty
    }
    catch { }
};
const getRouteFormulaContext = ({ env, req, route, serverContext, }) => {
    const { searchParamsWithDefaults, pathParams } = getParameters({
        route: route.source,
        req,
    });
    return {
        component: undefined,
        // destination formulas should only have access to URL parameters from
        // the route's source definition + global formulas.
        data: {
            Attributes: {},
            'Route parameters': {
                path: pathParams ?? {},
                query: searchParamsWithDefaults,
            },
        },
        env,
        package: undefined,
        toddle: serverContext,
    };
};
export const get404Page = (components) => getPages(components).find((page) => page.name === '404');
const getPages = (components) => Object.values(components).filter((c) => isDefined(c.route));
export const getPathSegments = (url) => url.pathname
    .substring(1)
    .split('/')
    .filter((s) => s !== '')
    .map((s) => decodeURIComponent(s));
//# sourceMappingURL=routing.js.map