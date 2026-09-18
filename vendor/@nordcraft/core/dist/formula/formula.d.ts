import type { Component, ComponentData } from '../component/component.types';
import type { CustomFormulaHandler, FormulaLookup, NordcraftMetadata, Nullable, Runtime } from '../types';
import { type FormulaEvaluationReporter, type PluginFormula, type ToddleFormula } from './formulaTypes';
type ShadowRoot = DocumentFragment;
interface BaseOperation extends NordcraftMetadata {
    label?: Nullable<string>;
}
export interface PathOperation extends BaseOperation {
    type: 'path';
    path: Array<string | number>;
}
export interface FunctionArgument {
    name?: Nullable<string>;
    isFunction?: Nullable<boolean>;
    formula: Formula;
    type?: Nullable<any>;
    testValue?: Nullable<any>;
}
export interface FunctionOperation extends BaseOperation {
    type: 'function';
    name: string;
    display_name?: Nullable<string>;
    package?: Nullable<string>;
    arguments?: Nullable<FunctionArgument[]>;
    variableArguments?: Nullable<boolean>;
}
export interface RecordOperation extends BaseOperation {
    type: 'record';
    entries?: Nullable<FunctionArgument[]>;
}
export interface ObjectOperation extends BaseOperation {
    type: 'object';
    arguments?: Nullable<FunctionArgument[]>;
}
export interface ArrayOperation extends BaseOperation {
    type: 'array';
    arguments?: Nullable<Array<{
        formula: Formula;
    }>>;
}
export interface OrOperation extends BaseOperation {
    type: 'or';
    arguments?: Nullable<Array<{
        formula: Formula;
    }>>;
}
export interface AndOperation extends BaseOperation {
    type: 'and';
    arguments?: Nullable<Array<{
        formula: Formula;
    }>>;
}
export interface ApplyOperation extends BaseOperation {
    type: 'apply';
    name: string;
    arguments?: Nullable<FunctionArgument[]>;
}
export interface ValueOperation extends BaseOperation {
    type: 'value';
    value: ValueOperationValue;
}
export type ValueOperationValue = string | number | boolean | null | object | undefined;
export interface SwitchOperation extends BaseOperation {
    type: 'switch';
    cases?: Nullable<Array<{
        condition: Formula;
        formula: Formula;
    }>>;
    default: Formula;
}
export type Formula = FunctionOperation | RecordOperation | ObjectOperation | ArrayOperation | PathOperation | SwitchOperation | OrOperation | AndOperation | ValueOperation | ApplyOperation;
export interface FormulaContext {
    component: Component | undefined;
    formulaCache?: Nullable<Record<string, {
        get: (data: ComponentData) => any;
        set: (data: ComponentData, result: any) => void;
    }>>;
    data: ComponentData;
    root?: Nullable<Document | ShadowRoot>;
    package: Nullable<string>;
    toddle: {
        getFormula: FormulaLookup;
        getCustomFormula: CustomFormulaHandler;
        errors: Error[];
    };
    jsonPath?: Array<string | number> | undefined;
    reportFormulaEvaluation?: FormulaEvaluationReporter | undefined;
    env: ToddleEnv | undefined;
}
export type ToddleServerEnv = {
    branchName: string;
    isServer: true;
    request: {
        headers: Record<string, string>;
        cookies: Record<string, string>;
        url: string;
    };
    runtime: never;
    logErrors: boolean;
};
export type ToddleEnv = ToddleServerEnv | {
    branchName: string;
    isServer: false;
    request: undefined;
    runtime: Runtime;
    logErrors: boolean;
};
export declare function isFormula(f: any): f is Formula;
export declare function isFormulaApplyOperation(formula: Formula): formula is ApplyOperation;
export declare const isToddleFormula: <Handler>(formula: PluginFormula<Handler>) => formula is ToddleFormula;
export declare function applyFormula(formula: Formula | string | number | undefined | null | boolean, ctx: FormulaContext, extendedPath?: Array<string | number> | undefined): any;
export {};
