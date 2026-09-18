import { isDefined } from '@nordcraft/core/dist/utils/util.js';
export const formulaHasValue = (formula) => isDefined(formula) && !(formula.type === 'value' && !isDefined(formula.value));
//# sourceMappingURL=formulaHasValue.js.map