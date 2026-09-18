import { filterObject, get, mapObject, } from '@nordcraft/core/dist/utils/collections.js';
import { isDefined } from '@nordcraft/core/dist/utils/util.js';
export function createFormulaCache(component) {
    if (!isDefined(component.formulas)) {
        return {};
    }
    return mapObject(filterObject(component.formulas, ([_, f]) => isDefined(f)), ([name, f]) => {
        const { canCache, keys } = f.memoize
            ? getFormulaCacheConfig(f.formula, component)
            : { canCache: false, keys: [] };
        let cacheInput;
        let cacheData;
        return [
            name,
            {
                get: (data) => {
                    if (canCache &&
                        cacheInput &&
                        keys.every((key) => {
                            return get(data, key) === get(cacheInput, key);
                        })) {
                        return { hit: true, data: cacheData };
                    }
                    return { hit: false };
                },
                set: (data, result) => {
                    if (canCache) {
                        cacheInput = data;
                        cacheData = result;
                    }
                },
            },
        ];
    });
}
function getFormulaCacheConfig(formula, component) {
    const paths = [];
    function visitOperation(op) {
        if (!op) {
            return;
        }
        if (op.type === 'path' && op.path[0] !== 'Args') {
            paths.push(op.path);
        }
        if (Array.isArray(op?.arguments)) {
            ;
            op?.arguments?.forEach((arg) => visitOperation(arg.formula));
        }
        if (op.type === 'record' && Array.isArray(op.entries)) {
            op.entries.forEach((arg) => visitOperation(arg.formula));
        }
        if (op.type === 'apply') {
            const formula = component.formulas?.[op.name];
            if (!formula) {
                return {
                    canCache: false,
                    keys: [],
                };
            }
            if (!formula.memoize) {
                throw new Error('Cannot memoize');
            }
            visitOperation(formula.formula);
        }
    }
    try {
        visitOperation(formula);
    }
    catch {
        return {
            canCache: false,
            keys: [],
        };
    }
    const keys = [];
    paths
        .sort((a, b) => a.length - b.length)
        .forEach((path) => {
        if (!keys.some((key) => key.every((k, i) => k === path[i]))) {
            keys.push(path);
        }
    });
    return {
        canCache: true,
        keys,
    };
}
//# sourceMappingURL=createFormulaCache.js.map