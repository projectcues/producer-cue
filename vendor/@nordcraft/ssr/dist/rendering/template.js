import { STRING_TEMPLATE } from '@nordcraft/core/dist/api/template';
import { isDefined } from '@nordcraft/core/dist/utils/util';
import { skipCookieHeader, skipHopByHopHeaders, skipNordcraftHeaders, } from '../utils/headers';
export const applyTemplateValues = (input, cookies) => {
    if (!isDefined(input)) {
        return '';
    }
    const cookieRegex = /{{ cookies\.(.+?) }}/gm;
    let output = input;
    const cookieNames = new Set();
    let m;
    while ((m = cookieRegex.exec(input)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === cookieRegex.lastIndex) {
            cookieRegex.lastIndex++;
        }
        const cookieName = m[1];
        if (typeof cookieName !== 'string') {
            continue;
        }
        cookieNames.add(cookieName);
    }
    for (const cookieName of cookieNames) {
        const cookieValue = cookies[cookieName];
        output = output.replaceAll(STRING_TEMPLATE('cookies', cookieName), 
        // We fallback to an empty string to avoid sending the internal
        // template format ('{{ cookies.<cookie> }}') to other services/APIs
        cookieValue ?? '');
    }
    return output;
};
export const sanitizeProxyHeaders = ({ cookies, headers, }) => new Headers(mapTemplateHeaders({
    cookies,
    headers: skipCookieHeader(skipNordcraftHeaders(skipHopByHopHeaders(headers))),
}));
export const mapTemplateHeaders = ({ cookies, headers, }) => new Headers([...headers.entries()].map(([name, value]) => [
    name,
    // Replace template values in the header value
    applyTemplateValues(value, cookies),
]));
//# sourceMappingURL=template.js.map