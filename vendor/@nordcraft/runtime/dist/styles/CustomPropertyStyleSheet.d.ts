import type { MediaQuery } from '@nordcraft/core/dist/component/component.types';
import type { Nullable } from '@nordcraft/core/dist/types';
/**
 * CustomPropertyStyleSheet is a utility class that manages CSS custom properties
 * (variables) in a dedicated CSSStyleSheet. It allows for efficient registration,
 * updating, and removal of style properties as fast as setting style properties.
 *
 * It abstracts the complexity of managing CSS rules via. indexing and
 * provides a simple API to register and unregister style properties for specific
 * selectors.
 */
export declare class CustomPropertyStyleSheet {
    private styleSheet;
    private ruleMap;
    constructor(root: Document | ShadowRoot, styleSheet?: Nullable<CSSStyleSheet>);
    /**
     * @returns A function to update the property value efficiently.
     */
    registerProperty(selector: string, name: string, options?: Nullable<{
        mediaQuery?: Nullable<MediaQuery>;
        startingStyle?: Nullable<boolean>;
    }>): (newValue: string) => void;
    unregisterProperty(selector: string, name: string, options?: Nullable<{
        mediaQuery?: Nullable<MediaQuery>;
        startingStyle?: Nullable<boolean>;
    }>): void;
    getStyleSheet(): CSSStyleSheet;
    /**
     * Maps all selectors to their rule index. This is used to map the initial
     * SSR style variable values to their selectors.
     */
    private hydrateFromBase;
    private static selectorFromCSSRule;
    private static getFullSelector;
    private static escapeSelector;
}
