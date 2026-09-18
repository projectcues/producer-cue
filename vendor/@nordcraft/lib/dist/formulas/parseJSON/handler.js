import { parseJSONWithDate } from '@nordcraft/core/dist/utils/json';
const handler = ([data, parseDate]) => {
    if (typeof data !== 'string') {
        return null;
    }
    try {
        // Similar to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
        if (parseDate === null || parseDate === undefined || Boolean(parseDate)) {
            return parseJSONWithDate(data);
        }
        return JSON.parse(data);
    }
    catch {
        return null;
    }
};
export default handler;
//# sourceMappingURL=handler.js.map