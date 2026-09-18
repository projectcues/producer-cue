import { isDefined } from '@nordcraft/core/dist/utils/util';
import { compile } from 'path-to-regexp';
export const getLocationUrl = ({ query, page, route, params, hash, }) => {
    let path;
    if (route) {
        const pathSegments = [];
        for (const segment of route.path) {
            if (segment.type === 'static') {
                pathSegments.push(segment.name);
            }
            else {
                const segmentValue = params[segment.name];
                if (isDefined(segmentValue)) {
                    pathSegments.push(segmentValue);
                }
                else {
                    // If a param is missing, we can't build the rest of the path
                    break;
                }
            }
        }
        path = '/' + pathSegments.join('/');
    }
    else {
        path = compile(page, { encode: encodeURIComponent })(params);
    }
    const hashString = hash === undefined || hash === '' ? '' : '#' + hash;
    const queryString = Object.entries(query)
        .filter(([_, q]) => q !== null)
        .map(([key, value]) => {
        return `${encodeURIComponent(route?.query[key]?.name ?? key)}=${encodeURIComponent(String(value))}`;
    })
        .join('&');
    return `${path}${hashString}${queryString.length > 0 ? '?' + queryString : ''}`;
};
//# sourceMappingURL=url.js.map