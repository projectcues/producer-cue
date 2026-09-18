import type { Component, NodeModel } from '@nordcraft/core/dist/component/component.types';
import type { Nullable } from '@nordcraft/core/dist/types';
/**
 * Function to strip styles and variants from a Component's nodes and convert them to static class names
 *
 * @param options - Options to control the behavior of the function
 *  - clearStyle: For pages, the classes are baked in so styles are not needed. For custom-elements and editor-preview, the styles are needed to be able to generate the classes and class hashes.
 * When clearStyle is false, the style is kept, but static custom properties are moved from custom properties to the style object. Dynamic custom properties are kept in the customProperties object for both cases.
 */
export declare const resolveClasses: (options?: {
    clearStyle: boolean;
}) => (component: Component) => {
    name: string;
    version?: Nullable<2>;
    page?: Nullable<string>;
    route?: Nullable<import("@nordcraft/core/dist/component/component.types").PageRoute>;
    attributes?: Nullable<Record<string, Nullable<import("@nordcraft/core/dist/component/component.types").ComponentAttribute>>>;
    variables?: Nullable<Record<string, Nullable<import("@nordcraft/core/dist/component/component.types").ComponentVariable>>>;
    formulas?: Nullable<Record<string, Nullable<import("@nordcraft/core/dist/component/component.types").ComponentFormula>>>;
    contexts?: Nullable<Record<string, import("@nordcraft/core/dist/component/component.types").ComponentContext>>;
    workflows?: Nullable<Record<string, Nullable<import("@nordcraft/core/dist/component/component.types").ComponentWorkflow>>>;
    apis?: Nullable<Record<string, Nullable<import("@nordcraft/core/dist/api/apiTypes").ComponentAPI>>>;
    events?: Nullable<Nullable<import("@nordcraft/core/dist/component/component.types").ComponentEvent>[]>;
    onLoad?: Nullable<import("@nordcraft/core/dist/component/component.types").EventModel>;
    onAttributeChange?: Nullable<import("@nordcraft/core/dist/component/component.types").EventModel>;
    exported?: Nullable<boolean>;
    customElement?: Nullable<{
        enabled?: Nullable<import("@nordcraft/core/dist/formula/formula").Formula>;
    }>;
    customCode?: Nullable<boolean>;
    nodes: Record<string, Nullable<NodeModel>>;
};
