import type { Nullable } from '../types';
export declare const isObject: (input: any) => input is Record<string, any>;
export declare const mapObject: <T, T2>(object: Record<string, T>, f: (kv: [string, T]) => [string, T2]) => Record<string, T2>;
export declare const mapValues: <T, T2>(object: Record<string, T>, f: (value: T) => T2) => Record<string, T2>;
/**
 * Deletes potentially nested keys from an object
 * @param collection Array or Object
 * @param path Path to the key to delete. For instance ['foo', 0, 'bar']
 * @returns The updated object/array
 */
export declare const omit: <T = object>(collection: T, path: PropertyKey[]) => T;
export declare const omitKeys: <T extends Record<string, any>>(object: T, keys: (keyof T)[]) => T;
type ValidPath<T> = [] | [keyof T, ...PropertyKey[]];
export declare const omitPaths: <T extends Record<string, any>>(object: T, keys: ValidPath<T>[]) => T;
export declare const groupBy: <T>(items: T[], f: (t: T) => string) => Record<string, T[]>;
export declare const filterObject: <T, T2 extends T = T>(object: Record<string, T>, f: (kv: [string, T]) => boolean) => Record<string, T2>;
export declare function get<T = any>(collection: T, path: Array<PropertyKey>): any;
export declare const set: <T = unknown>(collection: T, path: PropertyKey[], value: any) => T;
export declare const sortObjectEntries: <T>(object: Record<string, T>, f: (kv: [string, T]) => string | number | boolean, ascending?: boolean) => [string, T][];
export declare const easySort: <T>(collection: T[], f: (item: T) => string | number | boolean, ascending?: boolean) => T[];
export declare const deepSortObject: (obj: any) => Nullable<any[] | Record<string, any>>;
export {};
