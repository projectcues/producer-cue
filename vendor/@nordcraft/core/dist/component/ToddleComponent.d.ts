import { LegacyToddleApi } from '../api/LegacyToddleApi';
import { ToddleApiV2 } from '../api/ToddleApiV2';
import { type Formula } from '../formula/formula';
import type { GlobalFormulas } from '../formula/formulaTypes';
import type { ActionModel, Component, NodeModel } from './component.types';
export declare class ToddleComponent<Handler> {
    private component;
    private globalFormulas;
    private getComponent;
    packageName?: string;
    constructor({ component, getComponent, packageName, globalFormulas }: {
        component: Component;
        getComponent: (name: string, packageName?: string) => Component | undefined;
        packageName: string | undefined;
        globalFormulas: GlobalFormulas<Handler>;
    });
    get uniqueSubComponents(): ToddleComponent<Handler>[];
    /**
     * Traverse all formulas in the component.
     * @returns An iterable that yields the path and formula.
     */
    formulasInComponent(): Generator<{
        path: (string | number)[];
        formula: Formula;
        packageName?: string;
    }>;
    /**
     * Traverse all actions in the component.
     * @returns An iterable that yields the path and action.
     */
    actionModelsInComponent(): Generator<[(string | number)[], ActionModel]>;
    get formulas(): import("../types").Nullable<Record<string, import("../types").Nullable<import("./component.types").ComponentFormula>>>;
    get name(): string;
    get route(): import("../types").Nullable<import("./component.types").PageRoute>;
    get attributes(): import("../types").Nullable<Record<string, import("../types").Nullable<import("./component.types").ComponentAttribute>>>;
    get variables(): import("../types").Nullable<Record<string, import("../types").Nullable<import("./component.types").ComponentVariable>>>;
    get workflows(): import("../types").Nullable<Record<string, import("../types").Nullable<import("./component.types").ComponentWorkflow>>>;
    get apis(): {
        [k: string]: LegacyToddleApi<Handler> | ToddleApiV2<Handler>;
    };
    get nodes(): import("../types").Nullable<Partial<Record<string, NodeModel | null>>>;
    get events(): import("../types").Nullable<import("../types").Nullable<import("./component.types").ComponentEvent>[]>;
    get onLoad(): import("../types").Nullable<import("./component.types").EventModel>;
    get onAttributeChange(): import("../types").Nullable<import("./component.types").EventModel>;
    get isPage(): boolean;
    get contexts(): import("../types").Nullable<Record<string, import("./component.types").ComponentContext>>;
    get exported(): import("../types").Nullable<boolean>;
    get customElement(): import("../types").Nullable<{
        enabled?: import("../types").Nullable<Formula>;
    }>;
}
