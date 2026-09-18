/**
 * CustomPropertyStyleSheet is a utility class that manages CSS custom properties
 * (variables) in a dedicated CSSStyleSheet. It allows for efficient registration,
 * updating, and removal of style properties as fast as setting style properties.
 *
 * It abstracts the complexity of managing CSS rules via. indexing and
 * provides a simple API to register and unregister style properties for specific
 * selectors.
 */
export class CustomPropertyStyleSheet {
    styleSheet;
    // Selector to rule index mapping
    ruleMap;
    constructor(root, styleSheet) {
        if (styleSheet) {
            this.styleSheet = styleSheet;
        }
        else {
            this.styleSheet = new CSSStyleSheet();
            root.adoptedStyleSheets.push(this.getStyleSheet());
        }
    }
    /**
     * @returns A function to update the property value efficiently.
     */
    registerProperty(selector, name, options) {
        this.ruleMap ??= this.hydrateFromBase();
        const fullSelector = CustomPropertyStyleSheet.getFullSelector(CustomPropertyStyleSheet.escapeSelector(selector), options);
        // Check if the selector already exists
        let rule = this.ruleMap.get(fullSelector);
        if (!rule) {
            const ruleIndex = this.styleSheet.insertRule(fullSelector, this.styleSheet.cssRules.length);
            let newRule = this.styleSheet.cssRules[ruleIndex];
            // We are only interested in the dynamic style, so get the actual style rule, not media or other nested rules. Loop until we are at the bottom most rule.
            while (newRule.cssRules &&
                newRule.cssRules.length > 0) {
                newRule = newRule.cssRules[0];
            }
            rule = newRule;
            this.ruleMap.set(fullSelector, rule);
        }
        return (value) => {
            rule.style.setProperty(name, value);
        };
    }
    unregisterProperty(selector, name, options) {
        if (!this.ruleMap) {
            return;
        }
        const fullSelector = CustomPropertyStyleSheet.getFullSelector(CustomPropertyStyleSheet.escapeSelector(selector), options);
        const rule = this.ruleMap.get(fullSelector);
        if (!rule) {
            return;
        }
        rule.style.removeProperty(name);
        // Cleaning up empty selectors is probably not necessary in production and may have performance implications.
        // However, it is required for the editor-preview as it is a dynamic environment and things may get reordered and canvas reused.
        if (rule.style.length === 0) {
            this.styleSheet.deleteRule(Array.from(this.ruleMap.keys()).indexOf(fullSelector));
            this.ruleMap.delete(fullSelector);
        }
    }
    getStyleSheet() {
        return this.styleSheet;
    }
    /**
     * Maps all selectors to their rule index. This is used to map the initial
     * SSR style variable values to their selectors.
     */
    hydrateFromBase() {
        const ruleIndex = new Map();
        for (let i = 0; i < this.styleSheet.cssRules.length; i++) {
            let rule = this.styleSheet.cssRules[i];
            const selector = CustomPropertyStyleSheet.selectorFromCSSRule(rule);
            // Get last part of the selector, which is the actual selector we are interested in
            while (rule.cssRules &&
                rule.cssRules.length > 0) {
                rule = rule.cssRules[0];
            }
            ruleIndex.set(selector, rule);
        }
        return ruleIndex;
    }
    static selectorFromCSSRule(rule) {
        switch (rule.constructor.name) {
            case 'CSSStyleRule':
                // For these rules, we just return (potentially with subrules if any cssRules exist)
                return `${rule.selectorText} { ${Array.from(rule.cssRules)
                    .map(CustomPropertyStyleSheet.selectorFromCSSRule)
                    .join(', ')}}`;
            case 'CSSStartingStyleRule':
                return `@starting-style { ${Array.from(rule.cssRules)
                    .map(CustomPropertyStyleSheet.selectorFromCSSRule)
                    .join(', ')}}`;
            case 'CSSMediaRule':
                return `@media ${rule.media.mediaText} { ${Array.from(rule.cssRules)
                    .map(CustomPropertyStyleSheet.selectorFromCSSRule)
                    .join(', ')}}`;
            case 'CSSNestedDeclarations':
                return '';
            default:
                // eslint-disable-next-line no-console
                console.warn(`Unsupported CSS rule type: ${rule.constructor.name}. Returning empty selector.`);
                return '';
        }
    }
    static getFullSelector(selector, options) {
        let result = selector + (options?.startingStyle ? ' { @starting-style { }}' : ' { }');
        if (options?.mediaQuery) {
            result = `@media (${Object.entries(options.mediaQuery)
                .map(([key, value]) => `${key}: ${value}`)
                .filter(Boolean)
                .join(') and (')}) { ${result}}`;
        }
        return result;
    }
    static escapeSelector(selector) {
        // Fast path
        if (selector.indexOf('/') === -1) {
            return selector;
        }
        // Prefix forward slashes with double backslashes (if not already prefixed) to escape them in CSS selectors
        return selector.replace(/(^|[^\\])\//g, '$1\\/'); // Escape forward slashes
    }
}
//# sourceMappingURL=CustomPropertyStyleSheet.js.map