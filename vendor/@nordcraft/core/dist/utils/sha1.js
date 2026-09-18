import { deepSortObject } from './collections';
export const stableStringify = (obj) => JSON.stringify(deepSortObject(obj));
export const sha1 = async (data) => {
    const payload = new Uint8Array(stableStringify(data)
        .split('')
        .map(function (c) {
        return c.charCodeAt(0);
    }));
    const hashBuffer = await crypto.subtle.digest('SHA-1', payload);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
//# sourceMappingURL=sha1.js.map