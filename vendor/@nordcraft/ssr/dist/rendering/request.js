import { isDefined } from '@nordcraft/core/dist/utils/util.js';
import xss from 'xss';
export const escapeSearchParameter = (searchParameter) => typeof searchParameter === 'string' ? xss(searchParameter) : null;
export const escapeSearchParameters = (searchParams) => new URLSearchParams([...searchParams.entries()].reduce((params, [key, value]) => {
    const escapedValue = escapeSearchParameter(value);
    if (isDefined(escapedValue)) {
        params[key] = escapedValue;
    }
    return params;
}, {}));
//# sourceMappingURL=request.js.map