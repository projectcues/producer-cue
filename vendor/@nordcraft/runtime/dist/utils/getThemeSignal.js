import { applyFormula, } from '@nordcraft/core/dist/formula/formula.js';
import { THEME_COOKIE_NAME } from '@nordcraft/core/dist/styling/theme.const.js';
import { isDefined } from '@nordcraft/core/dist/utils/util.js';
import { signal } from '../signal/signal.js';
export const getThemeSignal = (component, dataSignal, env) => {
    const theme = component.route?.info?.theme;
    const themeFormula = theme?.formula;
    const dynamicTheme = themeFormula && themeFormula.type !== 'value';
    if (dynamicTheme) {
        const sig = dataSignal.map(() => applyFormula(themeFormula, {
            data: dataSignal.get(),
            component,
            root: document,
            package: undefined,
            toddle: window.toddle,
            env,
        }));
        return sig;
    }
    else if (isDefined(themeFormula)) {
        // Set static theme value
        return signal(themeFormula.value);
    }
    else {
        // This is the standard theme resolution logic, if not overridden:
        // 1. Check for 'nc-theme' cookie
        // 2. Default to null
        //    2.1 No theme set explicitly will default to system preference
        //    2.2 Default theme (or initial value) is handled in CSS
        const initialThemeValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${THEME_COOKIE_NAME}=`))
            ?.split('=')[1] ?? null;
        const sig = signal(initialThemeValue);
        // Listen to cookie store API changes for 'nc-theme'
        if ('cookieStore' in window) {
            cookieStore.addEventListener('change', (event) => {
                for (const change of event.changed) {
                    if (change.name === THEME_COOKIE_NAME) {
                        sig.set(change.value ?? null);
                    }
                }
                for (const removal of event.deleted) {
                    if (removal.name === THEME_COOKIE_NAME) {
                        sig.set(null);
                    }
                }
            });
        }
        return sig;
    }
};
//# sourceMappingURL=getThemeSignal.js.map