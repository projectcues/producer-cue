import type { Component, ComponentNodeModel, ElementNodeModel, NodeStyleModel } from '../component/component.types';
import type { Nullable } from '../types';
import type { OldTheme, Theme, ThemeOptions } from './theme';
export declare function kebabCase(string: string): string;
export declare const styleToCss: (style: Nullable<NodeStyleModel>) => string;
export declare const getNodeStyles: (node: ComponentNodeModel | ElementNodeModel, classHash: string, animationHashes?: Set<string>) => string;
export declare const createStylesheet: (root: Component, components: Component[], themes: Record<string, OldTheme | Theme>, options: ThemeOptions) => string;
export declare const getAllFonts: (components: Component[]) => Set<string>;
