import { getFormulasInFormula } from '@nordcraft/core/dist/formula/formulaUtils.js';
export class ToddleRoute {
    route;
    globalFormulas;
    constructor({ route, globalFormulas, }) {
        this.route = route;
        this.globalFormulas = globalFormulas;
    }
    /**
     * Traverse all formulas in the route
     * @returns An iterable that yields the path and formula.
     */
    *formulasInRoute() {
        const globalFormulas = this.globalFormulas;
        yield* getFormulasInFormula({
            formula: this.route.destination.url,
            globalFormulas,
            path: ['destination', 'url'],
        });
        for (const [key, path] of Object.entries(this.route.destination.path ?? {})) {
            yield* getFormulasInFormula({
                formula: path.formula,
                globalFormulas,
                path: ['destination', 'path', key, 'formula'],
            });
        }
        for (const [key, q] of Object.entries(this.route.destination.queryParams ?? {})) {
            yield* getFormulasInFormula({
                formula: q.formula,
                globalFormulas,
                path: ['destination', 'queryParams', key, 'formula'],
            });
            yield* getFormulasInFormula({
                formula: q.enabled,
                globalFormulas,
                path: ['destination', 'queryParams', key, 'enabled'],
            });
        }
    }
    get type() {
        return this.route.type;
    }
    get source() {
        return this.route.source;
    }
    get destination() {
        return this.route.destination;
    }
    get status() {
        return this.route.type === 'redirect' ? this.route.status : undefined;
    }
}
//# sourceMappingURL=ToddleRoute.js.map