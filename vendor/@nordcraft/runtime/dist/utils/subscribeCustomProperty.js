import { CUSTOM_PROPERTIES_STYLESHEET_ID } from '@nordcraft/core/dist/styling/theme.const';
import { CustomPropertyStyleSheet } from '../styles/CustomPropertyStyleSheet';
export const customPropertiesStylesheets = new WeakMap();
export function subscribeCustomProperty({ selector, customPropertyName, signal, variant, root, }) {
    let stylesheet = customPropertiesStylesheets.get(root);
    if (!stylesheet) {
        stylesheet = new CustomPropertyStyleSheet(root, root.getElementById(CUSTOM_PROPERTIES_STYLESHEET_ID)?.sheet);
        customPropertiesStylesheets.set(root, stylesheet);
    }
    signal.subscribe(stylesheet.registerProperty(selector, customPropertyName, variant), {
        destroy: () => {
            stylesheet?.unregisterProperty(selector, customPropertyName, {
                mediaQuery: variant?.mediaQuery,
                startingStyle: variant?.startingStyle,
            });
        },
    });
}
//# sourceMappingURL=subscribeCustomProperty.js.map