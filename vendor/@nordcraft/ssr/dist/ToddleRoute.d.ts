import type { Formula } from '@nordcraft/core/dist/formula/formula';
import type { GlobalFormulas } from '@nordcraft/core/dist/formula/formulaTypes';
import type { Route } from './ssr.types';
export declare class ToddleRoute<Handler> {
    private route;
    private globalFormulas;
    constructor({ route, globalFormulas }: {
        route: Route;
        globalFormulas: GlobalFormulas<Handler>;
    });
    /**
     * Traverse all formulas in the route
     * @returns An iterable that yields the path and formula.
     */
    formulasInRoute(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
    get type(): "redirect" | "rewrite";
    get source(): import("@nordcraft/core/dist/component/component.types").RouteDeclaration;
    get destination(): import("@nordcraft/core/dist/api/apiTypes").ApiBase;
    get status(): 300 | 301 | 302 | 303 | 304 | 307 | 308 | undefined;
}
