import type { ApiStatus, ComponentAPI, LegacyApiStatus } from '../api/apiTypes';
import type { Formula } from '../formula/formula';
import type { CssSyntaxNode } from '../styling/customProperty';
import type { StyleTokenCategory } from '../styling/theme';
import type { StyleVariant } from '../styling/variantSelector';
import type { NordcraftMetadata, Nullable, RequireFields } from '../types';
export interface ListItem {
    Item: unknown;
    Index: number;
    Parent?: Nullable<ListItem>;
}
export interface ComponentData {
    Location?: Nullable<{
        page?: Nullable<string>;
        path: string;
        params: Record<string, Nullable<string>>;
        query: Record<string, Nullable<string>>;
        hash: string;
    }>;
    Attributes: Record<string, unknown>;
    Variables?: Nullable<Record<string, unknown>>;
    Contexts?: Nullable<Record<string, Record<string, unknown>>>;
    'URL parameters'?: Nullable<Record<string, Nullable<string>>>;
    'Route parameters'?: Nullable<{
        path: Record<string, Nullable<string>>;
        query: Record<string, Nullable<string>>;
    }>;
    Apis?: Nullable<Record<string, Nullable<LegacyApiStatus | (ApiStatus & {
        inputs?: Nullable<Record<string, unknown>>;
    })>>>;
    Args?: Nullable<unknown>;
    Parameters?: Nullable<Record<string, unknown>>;
    Event?: Nullable<unknown>;
    ListItem?: Nullable<ListItem>;
    Page?: Nullable<{
        Theme: string | null;
    }>;
}
export interface AnimationKeyframe {
    position: Nullable<number>;
    key: Nullable<string>;
    value: Nullable<string>;
    easing?: Nullable<never>;
}
export type NodeStyleModel = Record<string, string | number>;
export interface TextNodeModel {
    id?: Nullable<string>;
    type: 'text';
    condition?: Nullable<Formula>;
    repeat?: Nullable<Formula>;
    slot?: Nullable<string>;
    repeatKey?: Nullable<Formula>;
    value: Formula;
    children?: Nullable<never>;
}
export type CustomPropertyName = `--${string}`;
export type CustomProperty = {
    formula: Formula;
    unit?: Nullable<string>;
    syntax?: CssSyntaxNode;
};
/**
 * @deprecated - use CustomProperties instead
 */
export type StyleVariable = {
    category: StyleTokenCategory;
    name: string;
    formula: Formula;
    unit?: Nullable<string>;
};
export interface ElementNodeModel {
    id?: Nullable<string>;
    type: 'element';
    slot?: Nullable<string>;
    condition?: Nullable<Formula>;
    repeat?: Nullable<Formula>;
    repeatKey?: Nullable<Formula>;
    tag: string;
    attrs?: Nullable<Partial<Record<string, Formula>>>;
    style?: Nullable<NodeStyleModel>;
    variants?: Nullable<StyleVariant[]>;
    animations?: Nullable<Record<string, Record<string, AnimationKeyframe>>>;
    children?: Nullable<string[]>;
    events?: Nullable<Partial<Record<string, Nullable<EventModel>>>>;
    classes?: Nullable<Record<string, {
        formula?: Nullable<Formula>;
    }>>;
    'style-variables'?: Nullable<Array<StyleVariable>>;
    customProperties?: Nullable<Record<CustomPropertyName, CustomProperty>>;
    styleVariables?: never;
}
export interface ComponentNodeModel {
    id?: Nullable<string>;
    type: 'component';
    slot?: Nullable<string>;
    path?: Nullable<string>;
    name: string;
    package?: Nullable<string>;
    condition?: Nullable<Formula>;
    repeat?: Nullable<Formula>;
    repeatKey?: Nullable<Formula>;
    style?: Nullable<NodeStyleModel>;
    variants?: Nullable<StyleVariant[]>;
    animations?: Nullable<Record<string, Record<string, AnimationKeyframe>>>;
    attrs?: Nullable<Record<string, Formula>>;
    children?: Nullable<string[]>;
    events?: Nullable<Partial<Record<string, Nullable<EventModel>>>>;
    customProperties?: Nullable<Record<CustomPropertyName, CustomProperty>>;
}
export interface SlotNodeModel {
    type: 'slot';
    slot?: Nullable<string>;
    name?: Nullable<string>;
    condition?: Nullable<Formula>;
    repeat?: Nullable<never>;
    repeatKey?: Nullable<never>;
    children?: Nullable<string[]>;
    events?: never;
}
export type NodeModel = TextNodeModel | SlotNodeModel | ComponentNodeModel | ElementNodeModel;
export interface MetaEntry {
    tag: HeadTagTypes;
    attrs?: Nullable<Record<string, Nullable<Formula>>>;
    content?: Nullable<Formula>;
    index?: Nullable<number>;
    enabled?: Nullable<Formula>;
}
export interface StaticPathSegment {
    type: 'static';
    optional?: Nullable<boolean>;
    testValue?: Nullable<never>;
    name: string;
}
export interface DynamicPathSegment {
    type: 'param';
    testValue: string;
    optional?: Nullable<boolean>;
    name: string;
}
export type MediaQuery = {
    'min-width'?: Nullable<string>;
    'max-width'?: Nullable<string>;
    'min-height'?: Nullable<string>;
    'max-height'?: Nullable<string>;
    'prefers-reduced-motion'?: Nullable<'reduce' | 'no-preference'>;
};
export interface Component {
    name: string;
    /**
     * version 2 indicates that the component's name is no longer prefixed, but will be automatically prefixed by the project name
     *
     * @default undefined (version 1)
     * @deprecated - we are no longer using version 2 components, but we are keeping this field for backwards compatibility
     */
    version?: Nullable<2>;
    page?: Nullable<string>;
    route?: Nullable<PageRoute>;
    attributes?: Nullable<Record<string, Nullable<ComponentAttribute>>>;
    variables?: Nullable<Record<string, Nullable<ComponentVariable>>>;
    formulas?: Nullable<Record<string, Nullable<ComponentFormula>>>;
    contexts?: Nullable<Record<string, ComponentContext>>;
    workflows?: Nullable<Record<string, Nullable<ComponentWorkflow>>>;
    apis?: Nullable<Record<string, Nullable<ComponentAPI>>>;
    nodes?: Nullable<Partial<Record<string, NodeModel | null>>>;
    events?: Nullable<Nullable<ComponentEvent>[]>;
    onLoad?: Nullable<EventModel>;
    onAttributeChange?: Nullable<EventModel>;
    exported?: Nullable<boolean>;
    customElement?: Nullable<{
        enabled?: Nullable<Formula>;
    }>;
    customCode?: Nullable<boolean>;
}
export interface ComponentFormula extends NordcraftMetadata {
    name?: string;
    arguments?: Nullable<Array<{
        name: string;
        testValue: any;
    }>>;
    memoize?: Nullable<boolean>;
    exposeInContext?: Nullable<boolean>;
    formula: Formula;
}
export interface ComponentWorkflow extends NordcraftMetadata {
    name?: string;
    parameters: Array<{
        name: string;
        testValue: any;
    }>;
    callbacks?: Nullable<Array<{
        name: string;
        testValue: any;
    }>>;
    actions: ActionModel[];
    exposeInContext?: Nullable<boolean>;
    testValue?: Nullable<unknown>;
}
export interface ComponentContext {
    formulas: string[];
    workflows: string[];
    componentName?: Nullable<string>;
    package?: Nullable<string>;
}
export type PageComponent = RequireFields<Component, 'route'>;
export interface RouteDeclaration {
    path: Array<StaticPathSegment | DynamicPathSegment>;
    query: Record<string, {
        name: string;
        testValue: any;
    }>;
}
export interface ResponseHeaders {
    [key: string]: Nullable<Formula | string>;
}
export interface PageRoute extends RouteDeclaration {
    response?: Nullable<{
        headers?: Nullable<ResponseHeaders>;
        status?: Nullable<Formula>;
    }>;
    info?: Nullable<{
        language?: Nullable<{
            formula: Formula;
        }>;
        theme?: Nullable<{
            formula: Formula;
        }>;
        title?: Nullable<{
            formula: Formula;
        }>;
        description?: Nullable<{
            formula: Formula;
        }>;
        icon?: Nullable<{
            formula: Formula;
        }>;
        charset?: Nullable<{
            formula: Formula;
        }>;
        meta?: Nullable<Record<string, MetaEntry>>;
    }>;
}
export declare enum HeadTagTypes {
    Meta = "meta",
    Link = "link",
    Script = "script",
    NoScript = "noscript",
    Style = "style"
}
export interface EventModel {
    trigger: string;
    actions?: Nullable<ActionModel[]>;
}
export interface CustomActionArgument {
    name: string;
    formula?: Nullable<Formula>;
    type?: Nullable<any>;
    description?: Nullable<string>;
}
export interface ActionModelActions {
    actions?: Nullable<ActionModel[]>;
}
export interface CustomActionModel {
    type?: Nullable<'Custom'>;
    package?: Nullable<string>;
    name: string;
    description?: Nullable<string>;
    group?: Nullable<unknown>;
    data?: Nullable<string | number | boolean | Formula>;
    arguments?: Nullable<Partial<CustomActionArgument[]>>;
    events?: Nullable<Record<string, ActionModelActions>>;
    version?: Nullable<2 | never>;
    label?: Nullable<string>;
}
export interface SwitchActionModel {
    type: 'Switch';
    data?: Nullable<string | number | boolean | Formula>;
    cases?: Nullable<Array<{
        condition: Nullable<Formula>;
        actions: ActionModel[];
    }>>;
    default?: Nullable<ActionModelActions>;
    arguments?: never;
}
export interface VariableActionModel {
    type: 'SetVariable';
    variable: string;
    data: Nullable<Formula>;
    arguments?: never;
}
export interface FetchActionModel {
    type: 'Fetch';
    api: string;
    inputs?: Nullable<Record<string, {
        formula?: Nullable<Formula>;
    }>>;
    onSuccess?: Nullable<ActionModelActions>;
    onError?: Nullable<ActionModelActions>;
    onMessage?: Nullable<ActionModelActions>;
}
export interface AbortFetchActionModel {
    type: 'AbortFetch';
    api: string;
}
export interface SetURLParameterAction {
    type: 'SetURLParameter';
    parameter: string;
    data?: Nullable<Formula>;
    historyMode?: Nullable<'replace' | 'push'>;
    arguments?: never;
}
export interface SetMultiUrlParameterAction {
    type: 'SetURLParameters';
    parameters: Record<string, Formula>;
    historyMode?: Nullable<'replace' | 'push'>;
}
export interface EventActionModel {
    type: 'TriggerEvent';
    event: string;
    data?: Nullable<Formula>;
    arguments?: never;
}
export interface WorkflowActionModel {
    type: 'TriggerWorkflow';
    workflow: string;
    parameters?: Nullable<Record<string, {
        formula?: Nullable<Formula>;
    }>>;
    callbacks?: Nullable<Partial<Record<string, {
        actions?: Nullable<Partial<ActionModel[]>>;
    }>>>;
    contextProvider?: Nullable<string>;
}
export interface WorkflowCallbackActionModel {
    type: 'TriggerWorkflowCallback';
    event: string;
    data?: Nullable<Formula>;
    arguments?: never;
}
export type ActionModel = VariableActionModel | EventActionModel | SwitchActionModel | FetchActionModel | AbortFetchActionModel | CustomActionModel | SetURLParameterAction | SetMultiUrlParameterAction | WorkflowActionModel | WorkflowCallbackActionModel;
export interface ComponentEvent extends NordcraftMetadata {
    name: string;
    dummyEvent: any;
}
export interface ComponentVariable extends NordcraftMetadata {
    initialValue: Formula;
    name?: never;
}
export interface ComponentAttribute extends NordcraftMetadata {
    name: string;
    testValue: unknown;
}
/**
 * We must specify the namespace for some nodes when created programmatically that are not in the default namespace.
 * We infer the namespace based on the tag name, but it would be interesting to also allow the user to specify it explicitly with the `xmlns` attribute.
 */
export type SupportedNamespaces = 'http://www.w3.org/1999/xhtml' | 'http://www.w3.org/2000/svg' | 'http://www.w3.org/1998/Math/MathML';
