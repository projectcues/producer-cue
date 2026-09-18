import type { Signal } from '../signal/signal';
import type { StyleVariant } from '@nordcraft/core/dist/styling/variantSelector';
import { CustomPropertyStyleSheet } from '../styles/CustomPropertyStyleSheet';
export declare const customPropertiesStylesheets: WeakMap<Document | ShadowRoot, CustomPropertyStyleSheet>;
export declare function subscribeCustomProperty({ selector, customPropertyName, signal, variant, root }: {
    selector: string;
    customPropertyName: string;
    signal: Signal<string>;
    variant?: StyleVariant;
    root: Document | ShadowRoot;
}): void;
