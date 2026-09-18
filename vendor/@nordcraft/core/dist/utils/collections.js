import { isDefined } from './util.js';
export const isObject = (input) => typeof input === 'object' && input !== null;
export const mapObject = (object, f) => {
    const result = {};
    for (const key in object) {
        const v = object[key];
        const [k, mappedV] = f([key, v]);
        result[k] = mappedV;
    }
    return result;
};
export const mapValues = (object, f) => {
    const result = {};
    for (const k in object) {
        result[k] = f(object[k]);
    }
    return result;
};
/**
 * Deletes potentially nested keys from an object
 * @param collection Array or Object
 * @param path Path to the key to delete. For instance ['foo', 0, 'bar']
 * @returns The updated object/array
 */
export const omit = (collection, path) => {
    const omitInternal = (coll, index) => {
        const key = path[index];
        if (index < path.length - 1) {
            const clone = Array.isArray(coll) ? [...coll] : { ...coll };
            clone[key] = omitInternal(clone[key], index + 1);
            return clone;
        }
        if (Array.isArray(coll)) {
            const arrClone = [...coll];
            arrClone.splice(Number(key), 1);
            return arrClone;
        }
        const clone = { ...coll };
        delete clone[key];
        return clone;
    };
    if (path.length === 0)
        return collection;
    return omitInternal(collection, 0);
};
export const omitKeys = (object, keys) => {
    const result = { ...object };
    const len = keys.length;
    for (let i = 0; i < len; i++) {
        const key = keys[i];
        delete result[key];
    }
    return result;
};
export const omitPaths = (object, keys) => keys.reduce((acc, key) => omit(acc, key), { ...object });
export const groupBy = (items, f) => {
    const result = Object.create(null);
    const len = items.length;
    for (let i = 0; i < len; i++) {
        const item = items[i];
        const key = f(item);
        const existing = result[key];
        if (existing === undefined) {
            result[key] = [item];
        }
        else {
            existing.push(item);
        }
    }
    return result;
};
export const filterObject = (object, f) => {
    const result = {};
    for (const k in object) {
        const v = object[k];
        if (f([k, v])) {
            result[k] = v;
        }
    }
    return result;
};
export function get(collection, path) {
    let current = collection;
    const len = path.length;
    for (let i = 0; i < len; i++) {
        const key = path[i];
        if (current === undefined || current === null) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}
export const set = (collection, path, value) => {
    const len = path.length;
    if (len === 0)
        return collection;
    const recurse = (current, index) => {
        const head = path[index];
        const clone = Array.isArray(current)
            ? [...current]
            : isObject(current)
                ? { ...current }
                : {};
        if (index === len - 1) {
            clone[head] = value;
            return clone;
        }
        clone[head] = recurse(clone[head], index + 1);
        return clone;
    };
    return recurse(collection, 0);
};
export const sortObjectEntries = (object, f, ascending = true) => easySort(Object.entries(object), f, ascending);
export const easySort = (collection, f, ascending = true) => [...collection].sort((a, b) => {
    const keyA = f(a);
    const keyB = f(b);
    if (keyA === keyB) {
        return 0;
    }
    return (keyA > keyB ? 1 : -1) * (ascending ? 1 : -1);
});
export const deepSortObject = (obj) => {
    if (!isDefined(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((val) => deepSortObject(val));
    }
    else if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        return [...Object.keys(obj)].sort().reduce((acc, key) => {
            acc[key] = deepSortObject(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};
//# sourceMappingURL=collections.js.map