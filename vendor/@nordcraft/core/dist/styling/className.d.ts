import type { ComponentNodeModel, ElementNodeModel, NodeStyleModel } from '../component/component.types';
import type { Nullable } from '../types';
import type { StyleVariant } from './variantSelector';
export declare const getClassName: (object: [Nullable<NodeStyleModel>, Nullable<StyleVariant[]>]) => string;
export declare const getPathClassName: (path: string) => string;
export declare const getStaticStyleAndVariants: (node: ComponentNodeModel | ElementNodeModel) => [Nullable<NodeStyleModel>, Nullable<StyleVariant[]>];
export declare const toValidClassName: (input: string, escapeSpecialCharacters?: boolean) => string;
