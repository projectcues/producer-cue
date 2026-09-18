import { type StyleVariant } from '../styling/variantSelector';
import type { Nullable } from '../types';
type NodeSelectorOptions = {
    componentName: string;
    nodeId: Nullable<string>;
    variant?: Nullable<StyleVariant>;
} | {
    componentName?: never;
    nodeId?: never;
    variant?: Nullable<StyleVariant>;
};
export declare function getNodeSelector(path: string, { componentName, nodeId, variant }?: NodeSelectorOptions): string;
export {};
