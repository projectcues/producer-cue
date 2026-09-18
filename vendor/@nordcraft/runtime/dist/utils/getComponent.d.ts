import type { Component } from '@nordcraft/core/dist/component/component.types';
/**
 * Project components is not expected to change during runtime, so we can memoize the components in a map for faster lookup.
 */
export declare const getComponent: (key: string, components: Component[], useCache?: boolean) => Component | undefined;
