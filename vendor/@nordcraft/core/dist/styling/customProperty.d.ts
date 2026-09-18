import type { CustomPropertyName } from '../component/component.types';
import type { Nullable } from '../types';
import type { CustomPropertyDefinition, Theme } from './theme';
export type CssSyntax = 'angle' | 'color' | 'custom-ident' | 'image' | 'integer' | 'length' | 'length-percentage' | 'number' | 'percentage' | 'resolution' | 'string' | 'time' | 'transform-function' | 'transform-list' | 'url' | '*';
export type CssCustomSyntax = 'font-family';
export type CssSyntaxNode = {
    type: 'primitive';
    name: CssSyntax;
} | {
    type: 'custom';
    name: CssCustomSyntax;
} | {
    type: 'keyword';
    keywords: string[];
};
export declare function stringifySyntaxNode(node: CssSyntaxNode): string;
export declare function renderSyntaxDefinition(key: CustomPropertyName, { syntax, inherits, initialValue }: CustomPropertyDefinition, theme: Theme): string;
export declare const appendUnit: (value: any, unit: Nullable<string>) => any;
