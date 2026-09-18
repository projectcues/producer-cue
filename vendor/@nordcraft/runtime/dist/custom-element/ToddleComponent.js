import { isLegacyApi } from '@nordcraft/core/dist/api/api';
import { applyFormula } from '@nordcraft/core/dist/formula/formula';
import { createStylesheet } from '@nordcraft/core/dist/styling/style.css';
import { theme as defaultTheme, THEME_DATA_ATTRIBUTE, } from '@nordcraft/core/dist/styling/theme.const';
import { filterObject, mapObject } from '@nordcraft/core/dist/utils/collections';
import { isDefined } from '@nordcraft/core/dist/utils/util';
import { isContextApiV2 } from '../api/apiUtils';
import { createLegacyAPI } from '../api/createAPI';
import { createAPI } from '../api/createAPIv2';
import { sortApis } from '../api/sortApis';
import { renderComponent } from '../components/renderComponent';
import { isContextProvider } from '../context/isContextProvider';
import { signal } from '../signal/signal';
import { getThemeSignal } from '../utils/getThemeSignal';
/**
 * Base class for all toddle components
 */
export class ToddleComponent extends HTMLElement {
    /**
     * Public reference to the toddle instance for debugging purposes. `el.toddle.errors` can be used to check for non-verbose errors.
     */
    toddle;
    #component;
    #ctx;
    #shadowRoot;
    #signal;
    #files;
    constructor(component, options, toddle) {
        super();
        this.toddle = toddle;
        const internals = this.attachInternals();
        if (internals.shadowRoot) {
            // Not used yet, but can be used to hydrate rather than render the shadow dom
            this.#shadowRoot = internals.shadowRoot;
        }
        else {
            this.#shadowRoot = this.attachShadow({ mode: 'open' });
        }
        const env = {
            branchName: toddle.branch || 'main',
            isServer: false,
            request: undefined,
            runtime: 'custom-element',
            logErrors: true,
        };
        this.#component = component;
        this.#signal = createSignal({
            component,
            root: this.#shadowRoot,
            toddle,
            env,
        });
        this.#files = {
            themes: options.themes,
        };
        // Call the abort signal if the component's datasignal is destroyed (component unmounted) to cancel any pending requests
        const abortController = new AbortController();
        this.#signal.subscribe(() => { }, {
            destroy: () => abortController.abort(`Component ${component.name} unmounted`),
        });
        this.#ctx = {
            triggerEvent: this.dispatch.bind(this),
            root: this.#shadowRoot,
            isRootComponent: true,
            components: options.components,
            component: this.#component,
            dataSignal: this.#signal,
            formulaCache: {},
            apis: {},
            abortSignal: abortController.signal,
            children: {},
            providers: {},
            stores: {
                theme: getThemeSignal(component, this.#signal, env),
            },
            package: undefined,
            toddle,
            env,
            jsonPath: [],
        };
    }
    connectedCallback() {
        sortApis(Object.entries(this.#component.apis ?? {}).filter((entry) => isDefined(entry[1]))).forEach(([name, api]) => {
            if (isLegacyApi(api)) {
                this.#ctx.apis[name] = createLegacyAPI(api, {
                    ...this.#ctx,
                    jsonPath: ['apis', name],
                });
            }
            else {
                this.#ctx.apis[name] = createAPI({
                    apiRequest: api,
                    ctx: {
                        ...this.#ctx,
                        jsonPath: ['apis', name],
                    },
                    componentData: this.#signal.get(),
                });
            }
        });
        Object.values(this.#ctx.apis)
            .filter(isContextApiV2)
            .forEach((api) => {
            api.triggerActions(this.#signal.get());
        });
        let providers = this.#ctx.providers;
        if (isContextProvider(this.#component)) {
            // Subscribe to exposed formulas and update the component's data signal
            const formulaDataSignals = Object.fromEntries(Object.entries(this.#component.formulas ?? {})
                .filter(([, formula]) => formula?.exposeInContext)
                .map(([name, formula]) => [
                name,
                this.#signal.map((data) => applyFormula(formula.formula, {
                    data,
                    component: this.#component,
                    formulaCache: this.#ctx.formulaCache,
                    root: this.#ctx.root,
                    package: this.#ctx.package,
                    toddle: this.#ctx.toddle,
                    env: this.#ctx.env,
                    jsonPath: [],
                }, ['formulas', name])),
            ]));
            providers = {
                ...providers,
                [this.#component.name]: {
                    component: this.#component,
                    formulaDataSignals,
                    ctx: this.#ctx,
                },
            };
        }
        this.#ctx.providers = providers;
        this.#ctx.stores.theme.subscribe((newTheme) => {
            this.#signal.update((data) => ({
                ...data,
                Page: {
                    ...(data.Page ?? {}),
                    Theme: newTheme,
                },
            }));
            if (isDefined(newTheme)) {
                this.setAttribute(THEME_DATA_ATTRIBUTE, newTheme);
            }
            else {
                this.removeAttribute(THEME_DATA_ATTRIBUTE);
            }
        });
        this.render();
    }
    disconnectedCallback() {
        this.#signal.destroy();
    }
    dispatch(eventName, data) {
        this.dispatchEvent(new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        const elements = renderComponent({
            ...this.#ctx,
            path: '0',
            onEvent: this.dispatch.bind(this),
            parentElement: this.#shadowRoot,
            instance: { [this.#component.name]: 'root' },
        });
        this.#shadowRoot.innerHTML = '';
        const styles = createStylesheet(this.#ctx.component, this.#ctx.components, Object.entries(this.#files.themes ?? {}).length > 0
            ? this.#files.themes
            : { defaultTheme }, { includeResetStyle: true, createFontFaces: false });
        const stylesElem = document.createElement('style');
        stylesElem.appendChild(document.createTextNode(styles));
        this.#shadowRoot.appendChild(stylesElem);
        const rootElement = elements[0];
        if (rootElement) {
            this.#shadowRoot.appendChild(rootElement);
        }
    }
    // Overload the setAttribute method to allow setting complex attributes
    setAttribute(name, value) {
        switch (typeof value) {
            case 'number':
                super.setAttribute(name, String(value));
                break;
            case 'string':
                super.setAttribute(name, value);
                // Return early, as signal is updated through attributeChangedCallback on string values
                return this;
            default:
                super.setAttribute(name, `[Object ${typeof value}]`);
                break;
        }
        // Update the signal with complex value
        this.#signal.set({
            ...this.#signal.get(),
            Attributes: {
                ...this.#signal.get().Attributes,
                [name]: value,
            },
        });
        return this;
    }
    // Overload the getAttribute method to point to source of truth (the signal)
    getAttribute(name) {
        return (this.#signal.get().Attributes[name] || super.getAttribute(name));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const attributeName = this.getAttributeCaseInsensitive(name);
        const currentRawValue = this.getAttribute(attributeName);
        // Is this is a complex value that has already been set by `setAttribute`
        if (newValue === '[Object object]') {
            return;
        }
        //Has this just been set by `setAttribute` as a number
        if (parseFloat(newValue) === currentRawValue) {
            return;
        }
        this.#signal.set({
            ...this.#signal.get(),
            Attributes: {
                ...this.#signal.get().Attributes,
                [attributeName]: newValue,
            },
        });
    }
    getAttributeCaseInsensitive(name) {
        const attributeName = Object.keys(this.#signal.get().Attributes).find((key) => key.toLowerCase() === name.toLowerCase());
        // This should never happen (TM) as we only observe attributes that are defined on the component
        if (!attributeName) {
            throw new Error(`Unable to find attribute ${name} on component ${this.#component.name}`);
        }
        return attributeName;
    }
    // Debugging purposes
    get __component() {
        return this.#component;
    }
    get __ctx() {
        return this.#ctx;
    }
    get __signal() {
        return this.#signal;
    }
}
export const createSignal = ({ component, root, toddle, env, }) => {
    return signal({
        // Pages are not supported as custom elements, so no need to add location signal
        Location: undefined,
        Variables: mapObject(filterObject(component.variables ?? {}, ([_, variable]) => isDefined(variable)), ([name, { initialValue }]) => {
            if (!component) {
                throw new Error(`Component not found`);
            }
            return [
                name,
                applyFormula(initialValue, {
                    data: {
                        Attributes: {},
                    },
                    component: component,
                    root,
                    package: undefined,
                    toddle,
                    env,
                }),
            ];
        }),
        Attributes: mapObject(component.attributes ?? {}, ([name]) => [
            name,
            // TODO: Perhaps we can get it from the DOM already and set initial attributes already?
            undefined,
        ]),
        Apis: mapObject(component.apis ?? {}, ([name]) => [
            name,
            { data: null, isLoading: false, error: null },
        ]),
    });
};
//# sourceMappingURL=ToddleComponent.js.map