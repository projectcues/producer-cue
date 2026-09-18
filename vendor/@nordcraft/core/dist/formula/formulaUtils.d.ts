import type { ActionModel } from '../component/component.types';
import type { Nullable } from '../types';
import type { Formula, FunctionOperation, PathOperation, ValueOperation } from './formula';
import type { GlobalFormulas } from './formulaTypes';
export declare const valueFormula: (value: string | number | boolean | object | null | undefined) => ValueOperation;
export declare const pathFormula: (path: string[]) => PathOperation;
export declare const functionFormula: (name: string, formula?: Omit<Partial<FunctionOperation>, "name" | "type"> | undefined) => FunctionOperation;
export declare function getFormulasInFormula<Handler>({ formula, globalFormulas, path: _path, visitedFormulas: _visitedFormulas, packageName }: {
    formula: Nullable<Formula>;
    globalFormulas: GlobalFormulas<Handler>;
    path?: Nullable<(string | number)[]>;
    visitedFormulas?: Nullable<Set<string>>;
    packageName?: Nullable<string>;
}): Generator<{
    path: (string | number)[];
    formula: Formula;
    packageName?: string;
}>;
export declare function getFormulasInAction<Handler>({ action, globalFormulas, path: _path, visitedFormulas, packageName }: {
    action: Nullable<ActionModel>;
    globalFormulas: GlobalFormulas<Handler>;
    path?: Nullable<(string | number)[]>;
    visitedFormulas?: Nullable<Set<string>>;
    packageName?: Nullable<string>;
}): Generator<{
    path: (string | number)[];
    formula: Formula;
    packageName?: string;
}>;
