import type { CustomProperty, CustomPropertyName, MediaQuery, NodeStyleModel } from '../component/component.types';
import type { Nullable } from '../types';
export type Shadow = {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    inset: boolean;
};
export type Filter = {
    name: 'Blur';
    radius: number;
} | {
    name: 'Opacity';
    percent: number;
};
export interface StyleVariant {
    'even-child'?: Nullable<boolean>;
    'first-child'?: Nullable<boolean>;
    'first-of-type'?: Nullable<boolean>;
    'focus-visible'?: Nullable<boolean>;
    'focus-within'?: Nullable<boolean>;
    'last-child'?: Nullable<boolean>;
    'last-of-type'?: Nullable<boolean>;
    'nth-child(even)'?: Nullable<boolean>;
    'popover-open'?: Nullable<boolean>;
    active?: Nullable<boolean>;
    autofill?: Nullable<boolean>;
    breakpoint?: Nullable<'small' | 'medium' | 'large'>;
    checked?: Nullable<boolean>;
    class?: Nullable<string>;
    className?: Nullable<string>;
    customProperties?: Nullable<Record<CustomPropertyName, CustomProperty>>;
    disabled?: Nullable<boolean>;
    empty?: Nullable<boolean>;
    evenChild?: Nullable<boolean>;
    firstChild?: Nullable<boolean>;
    focus?: Nullable<boolean>;
    focusWithin?: Nullable<boolean>;
    hover?: Nullable<boolean>;
    id?: Nullable<string>;
    invalid?: Nullable<boolean>;
    lastChild?: Nullable<boolean>;
    link?: Nullable<boolean>;
    mediaQuery?: Nullable<MediaQuery>;
    pseudoElement?: Nullable<string>;
    startingStyle?: Nullable<boolean>;
    style: Nullable<NodeStyleModel>;
    visited?: Nullable<boolean>;
}
export declare const variantSelector: (variant: StyleVariant) => string;
