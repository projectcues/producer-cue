import type { CustomPropertyName } from '../component/component.types';
import type { Nullable } from '../types';
import { type CssSyntaxNode } from './customProperty';
export interface ThemeOptions {
    includeResetStyle: boolean;
    createFontFaces: boolean;
}
export type StyleToken = {
    name: string;
    type: 'value' | 'variable';
    value: string;
};
export type StyleTokenGroup = {
    name: string;
    tokens: StyleToken[];
};
export type StyleTokenCategory = 'spacing' | 'color' | 'font-size' | 'font-weight' | 'z-index' | 'border-radius' | 'shadow';
export type FontFamily = {
    name: string;
    family: string;
    provider: 'google' | 'upload';
    type: 'serif' | 'sans-serif' | 'monospace' | 'cursive';
    variants?: Array<{
        name: string;
        weight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
        italic: boolean;
        url: string;
    }>;
};
export type OldTheme = {
    spacing: number;
    colors: Record<string, {
        order: number;
        variants: Record<string, {
            value: string;
            order: number;
        }>;
    }>;
    fontFamily: Record<string, {
        value: string[];
        order: number;
        default?: boolean;
    }>;
    fontWeight: Record<string, {
        value: string;
        order: number;
        default?: boolean;
    }>;
    fontSize: Record<string, {
        value: string;
        order: number;
        default?: boolean;
    }>;
    shadow: Record<string, {
        value: string;
        order: number;
    }>;
    breakpoints: Record<string, {
        value: number;
        order: number;
    }>;
};
export type Theme = {
    default?: string;
    defaultDark?: string;
    defaultLight?: string;
    propertyDefinitions?: Record<CustomPropertyName, CustomPropertyDefinition>;
    themes?: Record<string, {
        order?: number;
    }>;
    scheme?: 'dark' | 'light';
    color?: StyleTokenGroup[];
    fonts: FontFamily[];
    'font-size'?: StyleTokenGroup[];
    'font-weight'?: StyleTokenGroup[];
    spacing?: StyleTokenGroup[];
    'border-radius'?: StyleTokenGroup[];
    shadow?: StyleTokenGroup[];
    'z-index'?: StyleTokenGroup[];
};
export type CustomPropertyDefinition = {
    syntax: CssSyntaxNode;
    inherits: boolean;
    initialValue: Nullable<string>;
    description: string;
    values: Record<string, Nullable<string>>;
};
export declare const getThemeCss: (themes: Record<string, OldTheme | Theme>, options: ThemeOptions) => string;
export declare const getOldThemeCss: (theme: OldTheme) => string;
export declare function renderThemeValues(selector: string, entries: Record<string, string>, mediaQuery?: string): string;
export declare function getThemeEntries(theme: Theme, themeName: string | undefined): Record<string, string>;
