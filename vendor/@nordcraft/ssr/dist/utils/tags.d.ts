import type { Component } from '@nordcraft/core/dist/component/component.types';
/**
 * Used to replace any recursive references to the root component, as it would be rendered both by toddle runtime
 * and by the custom element itself (which would cause an infinite loop)
 */
export declare const replaceTagInNodes: (oldTag: string, newTag: string) => (component: Component) => {
    name: string;
    version?: import("@nordcraft/core/dist/types").Nullable<2>;
    page?: import("@nordcraft/core/dist/types").Nullable<string>;
    route?: import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").PageRoute>;
    attributes?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").ComponentAttribute>>>;
    variables?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").ComponentVariable>>>;
    formulas?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").ComponentFormula>>>;
    contexts?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/component/component.types").ComponentContext>>;
    workflows?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").ComponentWorkflow>>>;
    apis?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/api/apiTypes").ComponentAPI>>>;
    events?: import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").ComponentEvent>[]>;
    onLoad?: import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").EventModel>;
    onAttributeChange?: import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/component/component.types").EventModel>;
    exported?: import("@nordcraft/core/dist/types").Nullable<boolean>;
    customElement?: import("@nordcraft/core/dist/types").Nullable<{
        enabled?: import("@nordcraft/core/dist/types").Nullable<import("@nordcraft/core/dist/formula/formula").Formula>;
    }>;
    customCode?: import("@nordcraft/core/dist/types").Nullable<boolean>;
    nodes: {};
};
