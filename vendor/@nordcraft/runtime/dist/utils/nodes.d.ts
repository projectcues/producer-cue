import type { Component, NodeModel } from '@nordcraft/core/dist/component/component.types';
type NodeWithNodeId = NodeModel & {
    nodeId: string;
};
interface NodeAndAncestorLookup {
    node: NodeWithNodeId;
    ancestors: NodeWithNodeId[];
}
export declare const getNodeAndAncestors: (component: Component, root: NodeModel, id: unknown) => NodeAndAncestorLookup | undefined;
export declare const isNodeOrAncestorConditional: (nodeLookup?: NodeAndAncestorLookup | undefined) => nodeLookup is NodeAndAncestorLookup;
/**
 * @returns The next sibling element or null if this is the last element. A nc sibling is a sibling with a higher index or the same index but a higher repeat index.
 */
export declare const getNextSiblingElement: (path: string, parentElement: Element | ShadowRoot) => Element | null;
/**
 * This function efficiently ensures that:
 * 1. New items are added in the correct position.
 * 2. Existing items are not moved if they are already in the correct order.
 */
export declare function ensureEfficientOrdering(parentElement: Element | ShadowRoot, items: ReadonlyArray<Element | Text>, nextElement?: Element | Text | null): void;
export declare function stripNodeIdRepeatIndices(nodeId: string | null): string | null;
export {};
