import { isLegacyApi } from '@nordcraft/core/dist/api/api.js';
import { applyFormula } from '@nordcraft/core/dist/formula/formula.js';
import { THEME_DATA_ATTRIBUTE } from '@nordcraft/core/dist/styling/theme.const.js';
import { filterObject, mapObject } from '@nordcraft/core/dist/utils/collections.js';
import { VOID_HTML_ELEMENTS } from '@nordcraft/core/dist/utils/html.js';
import { isDefined } from '@nordcraft/core/dist/utils/util.js';
import * as libActions from '@nordcraft/std-lib/dist/actions.js';
import * as libFormulas from '@nordcraft/std-lib/dist/formulas.js';
import fastDeepEqual from 'fast-deep-equal';
import { match } from 'path-to-regexp';
import { isContextApiV2 } from './api/apiUtils.js';
import { createLegacyAPI } from './api/createAPI.js';
import { createAPI } from './api/createAPIv2.js';
import { sortApis } from './api/sortApis.js';
import { getDynamicMetaEntries } from './components/meta.js';
import { renderComponent } from './components/renderComponent.js';
import { isContextProvider } from './context/isContextProvider.js';
import { initLogState, registerComponentToLogState } from './debug/logState.js';
import { signal } from './signal/signal.js';
import { getThemeSignal } from './utils/getThemeSignal.js';
initLogState();
let env;
export const initGlobalObject = (code) => {
    const component = window.__toddle.component;
    const { params, hash, query } = parseUrl(component);
    env = {
        isServer: false,
        branchName: window.__toddle.branch,
        request: undefined,
        runtime: 'page',
        logErrors: true,
    };
    window.toddle = (() => {
        const legacyActions = {};
        const legacyFormulas = {};
        const argumentInputDataList = {};
        const toddle = {
            isEqual: fastDeepEqual,
            errors: [],
            project: window.__toddle.project,
            branch: window.__toddle.branch,
            commit: window.__toddle.commit,
            components: window.__toddle.components,
            formulas: code?.formulas ?? {},
            actions: code?.actions ?? {},
            registerAction: (name, handler) => {
                if (legacyActions[name]) {
                    // eslint-disable-next-line no-console
                    console.error('There already exists an action with the name ', name);
                    return;
                }
                legacyActions[name] = handler;
            },
            getAction: (name) => legacyActions[name],
            registerFormula: (name, handler, getArgumentInputData) => {
                if (legacyFormulas[name]) {
                    // eslint-disable-next-line no-console
                    console.error('There already exists a formula with the name ', name);
                    return;
                }
                legacyFormulas[name] = handler;
                if (getArgumentInputData) {
                    argumentInputDataList[name] = getArgumentInputData;
                }
            },
            getFormula: (name) => legacyFormulas[name],
            getCustomAction: (name, packageName) => {
                return (toddle.actions[packageName ?? window.__toddle.project]?.[name] ??
                    toddle.actions[window.__toddle.project]?.[name]);
            },
            getCustomFormula: (name, packageName) => {
                return (toddle.formulas[packageName ?? window.__toddle.project]?.[name] ??
                    toddle.formulas[window.__toddle.project]?.[name]);
            },
            // eslint-disable-next-line max-params
            getArgumentInputData: (formulaName, args, argIndex, data) => argumentInputDataList[formulaName]?.(args, argIndex, data) || data,
            data: {},
            locationSignal: signal({
                route: component.route,
                page: component.page,
                path: window.location.pathname,
                params,
                query,
                hash,
            }),
            eventLog: [],
            pageState: window.__toddle.pageState,
            env,
        };
        return toddle;
    })();
    // load default formulas and actions
    Object.entries(libFormulas).forEach(([name, module]) => window.toddle.registerFormula('@toddle/' + name, module.default, 'getArgumentInputData' in module
        ? module.getArgumentInputData
        : undefined));
    Object.entries(libActions).forEach(([name, module]) => window.toddle.registerAction('@toddle/' + name, module.default));
};
export const createRoot = (domNode) => {
    const component = window.__toddle.component;
    if (!domNode) {
        throw new Error('Cant find root domNode');
    }
    if (!window.toddle.components) {
        throw new Error('Missing components');
    }
    window.addEventListener('popstate', () => {
        if (!component) {
            return;
        }
        const { params, hash, query } = parseUrl(component);
        window.toddle.locationSignal.update(() => {
            return {
                route: component?.route,
                page: component.page,
                path: window.location.pathname,
                params,
                query,
                hash,
            };
        });
    });
    const routeSignal = window.toddle.locationSignal.map(({ query, params }) => {
        return { ...query, ...params };
    });
    const dataSignal = signal({
        ...window.toddle.pageState,
        // Re-initialize variables since some of them might rely on client-side
        // state (e.g. localStorage, sensors etc.)
        Variables: mapObject(filterObject(component.variables ?? {}, ([_, variable]) => isDefined(variable)), ([name, variable]) => [
            name,
            applyFormula(variable.initialValue, {
                data: window.toddle.pageState,
                component,
                formulaCache: {},
                root: document,
                package: undefined,
                toddle: window.toddle,
                env,
                jsonPath: [],
            }, ['variables', name]),
        ]),
    });
    registerComponentToLogState(component, dataSignal);
    routeSignal.subscribe((route) => dataSignal.update((data) => ({
        ...data,
        'URL parameters': route,
        Attributes: route,
    })));
    // Call the abort signal if the component's datasignal is destroyed (component unmounted) to cancel any pending requests
    const abortController = new AbortController();
    dataSignal.subscribe(() => { }, {
        destroy: () => abortController.abort(`Component ${component.name} unmounted`),
    });
    const ctx = {
        component,
        components: window.toddle.components,
        root: document,
        isRootComponent: true,
        dataSignal,
        abortSignal: abortController.signal,
        children: {},
        formulaCache: {},
        providers: {},
        stores: {
            theme: getThemeSignal(component, dataSignal, env),
        },
        apis: {},
        toddle: window.toddle,
        triggerEvent: (event, data) => 
        // eslint-disable-next-line no-console
        console.info('EVENT FIRED', event, data),
        package: undefined,
        env,
        jsonPath: [],
    };
    // Note: this function must run procedurally to ensure apis (which are in correct order) can reference each other
    sortApis(Object.entries(component.apis ?? {}).filter((entry) => isDefined(entry[1]))).forEach(([name, api]) => {
        if (isLegacyApi(api)) {
            ctx.apis[name] = createLegacyAPI(api, {
                ...ctx,
                jsonPath: ['apis', name],
            });
        }
        else {
            ctx.apis[name] = createAPI({
                apiRequest: api,
                ctx: {
                    ...ctx,
                    jsonPath: ['apis', name],
                },
                componentData: dataSignal.get(),
            });
        }
    });
    // Trigger actions for all APIs after all of them are created.
    Object.values(ctx.apis)
        .filter(isContextApiV2)
        .forEach((api) => {
        api.triggerActions(dataSignal.get());
    });
    let providers = ctx.providers;
    if (isContextProvider(component)) {
        // Subscribe to exposed formulas and update the component's data signal
        const formulaDataSignals = Object.fromEntries(Object.entries(component.formulas ?? {})
            .filter(([, formula]) => formula?.exposeInContext)
            .map(([name, formula]) => [
            name,
            dataSignal.map((data) => applyFormula(formula.formula, {
                data,
                component,
                formulaCache: ctx.formulaCache,
                root: ctx.root,
                package: ctx.package,
                toddle: window.toddle,
                env,
            })),
        ]));
        providers = {
            ...providers,
            [component.name]: {
                component,
                formulaDataSignals,
                ctx,
            },
        };
    }
    ctx.stores.theme.subscribe((newTheme) => {
        // The page's dataSignal also needs to be updated so that `Page.Theme` formulas works on page components
        dataSignal.update((data) => ({
            ...data,
            Page: {
                ...(data.Page ?? {}),
                Theme: newTheme,
            },
        }));
        if (isDefined(newTheme)) {
            document.documentElement.setAttribute(THEME_DATA_ATTRIBUTE, newTheme);
        }
        else {
            document.documentElement.removeAttribute(THEME_DATA_ATTRIBUTE);
        }
    });
    // We can only setup meta updates after the dataSignal has been initiated with API data etc.
    setupMetaUpdates(component, dataSignal);
    const elements = renderComponent({
        ...ctx,
        providers,
        path: '0',
        package: undefined,
        onEvent: ctx.triggerEvent,
        parentElement: domNode,
        instance: {},
    });
    domNode.innerText = '';
    elements.forEach((elem) => {
        domNode.appendChild(elem);
    });
    window.__toddle.isPageLoaded = true;
};
function parseUrl(component) {
    const path = window.location.pathname.split('/').slice(1);
    let params = {};
    if (component.route) {
        component.route.path.forEach((segment, i) => {
            if (segment.type === 'param') {
                if (isDefined(path[i]) && path[i] !== '') {
                    params[segment.name] = decodeURIComponent(path[i]);
                }
                else {
                    params[segment.name] = null;
                }
            }
            else {
                params[segment.name] = segment.name;
            }
        });
    }
    else {
        const urlPattern = match(component.page ?? '', {
            decode: decodeURIComponent,
        });
        const res = urlPattern(window.location.pathname) || {
            params: {},
        };
        params = res.params;
    }
    const [hash] = window.location.hash.split('?');
    const query = parseQuery(window.location.search);
    // Explicitly set all query params to null by default
    // to avoid undefined values in the runtime
    const defaultQueryParams = Object.keys(component.route?.query ?? {}).reduce((params, key) => ({ ...params, [key]: null }), {});
    return {
        params,
        hash: hash?.slice(1),
        query: { ...defaultQueryParams, ...query },
    };
}
const parseQuery = (queryString) => Object.fromEntries(queryString
    .replace('?', '')
    .split('&')
    .filter((pair) => pair !== '')
    .map((pair) => {
    return pair.split('=').map(decodeURIComponent);
}));
const setupMetaUpdates = (component, dataSignal) => {
    const getFormulaContext = (data) => ({
        data,
        component,
        root: document,
        package: undefined,
        toddle: window.toddle,
        env,
    });
    // Handle dynamic updates of the document language
    const langFormula = component.route?.info?.language?.formula;
    const dynamicLang = langFormula && langFormula.type !== 'value';
    if (dynamicLang) {
        dataSignal
            .map((data) => component
            ? applyFormula(langFormula, getFormulaContext(data), [
                'route',
                'info',
                'language',
            ])
            : null)
            .subscribe((newLang) => {
            if (isDefined(newLang) && document.documentElement.lang !== newLang) {
                document.documentElement.setAttribute('lang', newLang);
            }
        });
    }
    // Handle dynamic updates of <head> elements (title, og:image etc.)
    const titleFormula = component.route?.info?.title?.formula;
    const dynamicTitle = titleFormula && titleFormula.type !== 'value';
    if (dynamicTitle) {
        dataSignal
            .map((data) => component
            ? applyFormula(titleFormula, getFormulaContext(data), [
                'route',
                'info',
                'title',
            ])
            : null)
            .subscribe((newTitle) => {
            if (isDefined(newTitle) && document.title !== newTitle) {
                document.title = newTitle;
            }
        });
    }
    const descriptionFormula = component.route?.info?.description?.formula;
    const meta = component.route?.info?.meta;
    const dynamicDescription = descriptionFormula && descriptionFormula.type !== 'value';
    const dynamicMetaFormulas = getDynamicMetaEntries(meta);
    if (dynamicDescription || Object.keys(dynamicMetaFormulas).length > 0) {
        const findMetaElement = (name) => [...document.getElementsByTagName('meta')].find((el) => el.name === name || el.getAttribute('property') === name) ?? null;
        const updateMetaElement = (entry, id) => {
            let existingElement = null;
            if (isDefined(id)) {
                existingElement = document.querySelector(`[data-toddle-id="${id}"]`);
            }
            else {
                const identifier = Object.entries(entry.attrs ?? {}).find(([key]) => ['property', 'name'].includes(key.toLowerCase()))?.[1];
                if (isDefined(identifier)) {
                    existingElement = findMetaElement(identifier);
                }
            }
            if (!existingElement) {
                // If the element didn't already exist, create it
                existingElement = document.createElement(entry.tag);
                if (isDefined(id)) {
                    existingElement.setAttribute('data-toddle-id', id);
                }
                document.getElementsByTagName('head')[0].appendChild(existingElement);
            }
            // Apply all attributes to the element
            Object.entries(entry.attrs ?? {}).forEach(([key, value]) => {
                if (!component) {
                    return;
                }
                existingElement.setAttribute(key, value);
            });
            if (typeof entry.content === 'string' &&
                !VOID_HTML_ELEMENTS.includes(entry.tag.toLowerCase())) {
                existingElement.textContent = entry.content;
            }
        };
        if (dynamicDescription) {
            dataSignal
                .map((data) => component
                ? applyFormula(descriptionFormula, getFormulaContext(data), [
                    'route',
                    'info',
                    'description',
                ])
                : null)
                .subscribe((newDescription) => {
                if (isDefined(newDescription)) {
                    let descriptionElement = document
                        .getElementsByTagName('meta')
                        .namedItem('description');
                    if (!descriptionElement) {
                        descriptionElement = document.createElement('meta');
                        descriptionElement.name = 'description';
                    }
                    descriptionElement.content = newDescription;
                    document
                        .getElementsByTagName('head')[0]
                        .appendChild(descriptionElement);
                    if (meta &&
                        !Object.values(meta).some((m) => Object.entries(m.attrs ?? {}).some(([k, value]) => k.toLowerCase() === 'property' &&
                            value?.type === 'value' &&
                            typeof value.value === 'string' &&
                            value.value.toLowerCase() === 'og:description'))) {
                        // If there is no formula for the og:description meta tag,
                        // add it with the same value as the description meta tag
                        // this mimics the behavior from our SSR
                        updateMetaElement({
                            tag: 'meta',
                            attrs: {
                                property: 'og:description',
                                content: newDescription,
                            },
                            content: undefined,
                        });
                    }
                }
            });
        }
        if (Object.keys(dynamicMetaFormulas).length > 0) {
            for (const id in dynamicMetaFormulas) {
                const entry = dynamicMetaFormulas[id];
                if (entry) {
                    dataSignal
                        .map((data) => {
                        const context = getFormulaContext(data);
                        // Return the new values for all attributes (we assume they're strings)
                        const values = Object.entries(entry.attrs ?? {}).reduce((agg, [key, formula]) => component
                            ? {
                                ...agg,
                                [key]: applyFormula(formula, context, [
                                    'route',
                                    'info',
                                    'meta',
                                    id,
                                    'attrs',
                                    key,
                                ]),
                            }
                            : agg, {});
                        return {
                            attrs: values,
                            content: entry.content
                                ? applyFormula(entry.content, context)
                                : undefined,
                        };
                    })
                        .subscribe(({ attrs, content }) => 
                    // Update the meta tags with the new values
                    updateMetaElement({ tag: entry.tag, attrs, content }, id));
                }
            }
        }
    }
};
//# sourceMappingURL=page.main.js.map