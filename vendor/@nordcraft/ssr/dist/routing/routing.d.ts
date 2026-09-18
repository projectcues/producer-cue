import type { PageComponent, PageRoute } from '@nordcraft/core/dist/component/component.types';
import type { ToddleEnv } from '@nordcraft/core/dist/formula/formula';
import type { Route } from '../ssr.types';
export declare const matchPageForUrl: <P extends Pick<PageComponent, "name" | "route">>({ url, pages, }: {
    url: URL;
    pages: P[];
}) => {
    name: string;
    route: P;
} | undefined;
export declare const matchRouteForUrl: ({ env, req, routes, serverContext, url, }: {
    env: ToddleEnv;
    req: Request;
    routes?: Record<string, Route> | undefined;
    serverContext: {
        getFormula: import("@nordcraft/core/dist/types").FormulaLookup;
        getCustomFormula: import("@nordcraft/core/dist/types").CustomFormulaHandler;
        errors: Error[];
    };
    url: URL;
}) => {
    name: string;
    route: Route;
} | undefined;
export declare const matchRoutes: <T>({ url, entries, getRoute, }: {
    url: URL;
    entries: Record<string, T>;
    getRoute: (entry: T) => Pick<PageRoute, "path" | "query">;
}) => {
    name: string;
    route: T;
} | undefined;
export declare const getRouteDestination: ({ serverContext, req, route, env, }: {
    serverContext: {
        getFormula: import("@nordcraft/core/dist/types").FormulaLookup;
        getCustomFormula: import("@nordcraft/core/dist/types").CustomFormulaHandler;
        errors: Error[];
    };
    req: Request;
    route: Route;
    env: ToddleEnv;
}) => URL | undefined;
export declare const get404Page: (components: Partial<Record<string, import("@nordcraft/core/dist/component/component.types").Component>>) => PageComponent | undefined;
export declare const getPathSegments: (url: URL) => string[];
