import type { Formula } from '@nordcraft/core/dist/formula/formula';
import type { GlobalFormulas } from '@nordcraft/core/dist/formula/formulaTypes';
import type { ApiService } from './ssr.types';
export declare class ToddleApiService<Handler> {
    private service;
    private globalFormulas;
    constructor({ service, globalFormulas }: {
        service: ApiService;
        globalFormulas: GlobalFormulas<Handler>;
    });
    /**
     * Traverse all formulas in the API Service.
     * @returns An iterable that yields the path and formula.
     */
    formulasInService(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
    get name(): string;
    get baseUrl(): Formula | undefined;
    get docsUrl(): Formula | undefined;
    get apiKey(): Formula | undefined;
    get meta(): Record<string, unknown> | {
        projectUrl?: Formula | undefined;
    } | undefined;
}
