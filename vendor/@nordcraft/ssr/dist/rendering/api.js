import { ToddleComponent } from '@nordcraft/core/dist/component/ToddleComponent.js';
import { mapObject } from '@nordcraft/core/dist/utils/collections.js';
import { isDefined } from '@nordcraft/core/src/utils/util';
const compareApiDependencies = (a, b) => {
    if (!isDefined(a)) {
        return 1;
    }
    if (!isDefined(b)) {
        return -1;
    }
    const isADependentOnB = a.dependsOn?.includes(b.name) ?? false;
    const isBDependentOnA = b.dependsOn?.includes(a.name) ?? false;
    if (isADependentOnB === isBDependentOnA) {
        return 0;
    }
    // 1 means A goes last - hence B is evaluated before A
    return isADependentOnB ? 1 : -1;
};
export const sortApiEntries = (apis) => [...apis].sort(([_, a], [__, b]) => compareApiDependencies(a, b));
export const processComponentApis = (component, files) => {
    const toddleComponent = new ToddleComponent({
        component,
        getComponent: (name, packageName) => {
            const nodeLookupKey = [packageName, name].filter(isDefined).join('/');
            const component = packageName
                ? files.packages?.[packageName]?.components[name]
                : files.components[name];
            if (!component) {
                // eslint-disable-next-line no-console
                console.warn(`Unable to find component ${nodeLookupKey} in files`);
                return undefined;
            }
            return component;
        },
        packageName: undefined,
        globalFormulas: {
            formulas: files.formulas,
            packages: files.packages,
        },
    });
    return {
        ...component,
        apis: component.apis
            ? mapObject(component.apis, ([key, api]) => [
                key,
                { ...api, dependsOn: toddleComponent.apis[key]?.dependsOn ?? [] },
            ])
            : undefined,
    };
};
//# sourceMappingURL=api.js.map