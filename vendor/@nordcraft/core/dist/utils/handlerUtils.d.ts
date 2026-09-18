/**
 * Removes non-alphanumeric characters except for _ from a function name
 * @param name
 * @returns "safe" function name only containing alphanumeric characters and _, e.g. "myFunction" or "my_function"
 */
export declare const safeFunctionName: (name: string) => string;
