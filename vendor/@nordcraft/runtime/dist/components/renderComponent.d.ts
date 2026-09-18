import type { Component, ComponentData, SupportedNamespaces } from '@nordcraft/core/dist/component/component.types';
import type { ToddleEnv } from '@nordcraft/core/dist/formula/formula';
import type { FormulaEvaluationReporter } from '@nordcraft/core/dist/formula/formulaTypes';
import type { Toddle } from '@nordcraft/core/dist/types';
import type { Signal } from '../signal/signal';
import type { ComponentChild, ComponentContext, ContextApi, FormulaCache, LocationSignal, PreviewShowSignal } from '../types';
interface RenderComponentProps {
    component: Component;
    components: Component[];
    dataSignal: Signal<ComponentData>;
    apis: Record<string, ContextApi>;
    abortSignal: AbortSignal;
    onEvent: (event: string, data: unknown) => void;
    isRootComponent: boolean;
    formulaCache: FormulaCache;
    path: string;
    children: Record<string, Array<ComponentChild>>;
    root: Document | ShadowRoot;
    providers: Record<string, {
        component: Component;
        formulaDataSignals: Record<string, Signal<ComponentData>>;
        ctx: ComponentContext;
    }>;
    stores: {
        theme: Signal<string | null>;
    };
    package: string | undefined;
    parentElement: Element | ShadowRoot;
    instance: Record<string, string>;
    toddle: Toddle<LocationSignal, PreviewShowSignal>;
    namespace?: SupportedNamespaces;
    env: ToddleEnv;
    jsonPath: Array<string | number> | undefined;
    reportFormulaEvaluation?: FormulaEvaluationReporter;
}
export declare function renderComponent({ component, dataSignal, onEvent, isRootComponent, path, children, formulaCache, components, apis, abortSignal, root, providers, package: packageName, stores, parentElement, instance, toddle, namespace, env, jsonPath, reportFormulaEvaluation }: RenderComponentProps): ReadonlyArray<Element | Text>;
export {};
