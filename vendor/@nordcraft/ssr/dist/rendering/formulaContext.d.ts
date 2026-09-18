import type { PageComponent, PageRoute } from '@nordcraft/core/dist/component/component.types';
import type { FormulaContext, ToddleServerEnv } from '@nordcraft/core/dist/formula/formula';
import type { InstalledPackage, ProjectFiles } from '../ssr.types';
/**
 * Builds a FormulaContext that can be used to evaluate formulas for a page component
 * It also initializes data->Variables with their initial values based on the FormulaContext
 */
export declare const getPageFormulaContext: ({ branchName, component, req, logErrors, files, }: {
    branchName: string;
    component: PageComponent | undefined;
    req: Request;
    logErrors: boolean;
    files: ProjectFiles;
}) => FormulaContext & {
    env: ToddleServerEnv;
};
export declare const getServerToddleObject: (files: Pick<ProjectFiles, "formulas" | "packages"> & {
    packages?: Partial<Record<string, Pick<InstalledPackage, "formulas">>> | undefined;
}) => {
    getFormula: import("@nordcraft/core/dist/types").FormulaLookup;
    getCustomFormula: import("@nordcraft/core/dist/types").CustomFormulaHandler;
    errors: Error[];
};
export declare const getDataUrlParameters: ({ route, req, }: {
    route: Pick<PageRoute, "path" | "query">;
    req: Request;
}) => {};
export declare const getParameters: ({ route, req, }: {
    route?: Pick<PageRoute, "path" | "query"> | undefined;
    req: Request;
}) => {
    pathParams: {} | undefined;
    searchParamsWithDefaults: {
        [x: string]: string | null;
    };
    combinedParams: {};
    hash: string;
    url: URL;
};
export declare const serverEnv: ({ branchName, req, logErrors, }: {
    branchName: string;
    req: Request;
    logErrors: boolean;
}) => ToddleServerEnv;
export declare const getThemeInitialValue: (component: PageComponent, formulaContext: FormulaContext, env: ToddleServerEnv) => string | null;
