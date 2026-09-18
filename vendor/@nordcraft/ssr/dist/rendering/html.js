import { applyFormula } from '@nordcraft/core/dist/formula/formula.js';
import { THEME_COOKIE_NAME } from '@nordcraft/core/dist/styling/theme.const.js';
export const getHtmlLanguage = ({ pageInfo, formulaContext, defaultLanguage = 'en', }) => {
    const language = pageInfo?.language
        ? applyFormula(pageInfo.language.formula, formulaContext)
        : defaultLanguage;
    return typeof language === 'string' ? language : defaultLanguage;
};
export const getCharset = ({ pageInfo, formulaContext, defaultCharset = 'utf-8', }) => {
    const charset = pageInfo?.charset
        ? applyFormula(pageInfo.charset.formula, formulaContext)
        : defaultCharset;
    return typeof charset === 'string' ? charset : defaultCharset;
};
export const getTheme = ({ pageInfo, formulaContext, }) => {
    const theme = pageInfo?.theme?.formula
        ? applyFormula(pageInfo.theme.formula, formulaContext)
        : formulaContext.env?.request?.cookies[THEME_COOKIE_NAME];
    return typeof theme === 'string' ? theme : null;
};
//# sourceMappingURL=html.js.map