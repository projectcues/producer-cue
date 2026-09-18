import type { Component } from '@nordcraft/core/dist/component/component.types';
import type { FormulaContext, ToddleServerEnv } from '@nordcraft/core/dist/formula/formula';
import type { ProjectFiles } from '../ssr.types';
import type { ApiCache, ApiEvaluator } from './api';
/**
 * Renders a page body for a given ToddleComponent
 */
export declare const renderPageBody: ({ component, env, evaluateComponentApis, files, formulaContext, includedComponents, req, projectId, }: {
    component: Component;
    env: ToddleServerEnv;
    evaluateComponentApis: ApiEvaluator;
    files: ProjectFiles;
    formulaContext: FormulaContext;
    includedComponents: Component[];
    req: Request;
    projectId: string;
}) => Promise<{
    html: string;
    apiCache: ApiCache;
    customProperties: string[];
}>;
