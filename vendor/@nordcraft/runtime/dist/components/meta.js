import { isDefined } from '@nordcraft/core/dist/utils/util.js';
export const getDynamicMetaEntries = (meta) => {
    if (!meta) {
        return {};
    }
    const dynamicMetaEntries = {};
    for (const key in meta) {
        const entry = meta[key];
        if (isDefined(entry.content) && entry.content.type !== 'value') {
            dynamicMetaEntries[key] = entry;
        }
        else if (Object.values(entry.attrs ?? {}).some((a) => a?.type !== 'value')) {
            dynamicMetaEntries[key] = entry;
        }
    }
    return dynamicMetaEntries;
};
//# sourceMappingURL=meta.js.map