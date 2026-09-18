import { isDefined } from '@nordcraft/core/dist/utils/util.js';
import { parse } from 'cookie';
export const getRequestCookies = (req) => Object.fromEntries(Object.entries(parse(req.headers.get('cookie') ?? '')).filter(
// Ensure that both key and value are defined
(kv) => isDefined(kv[0]) && isDefined(kv[1])));
//# sourceMappingURL=cookies.js.map