import { isPageComponent } from '@nordcraft/core/dist/component/isPageComponent';
import { applyFormula, isToddleFormula, } from '@nordcraft/core/dist/formula/formula';
import {} from '@nordcraft/core/dist/formula/formulaTypes';
import { createStylesheet } from '@nordcraft/core/dist/styling/style.css';
import { theme as defaultTheme } from '@nordcraft/core/dist/styling/theme.const';
import { filterObject, mapObject } from '@nordcraft/core/dist/utils/collections';
import { toBoolean } from '@nordcraft/core/dist/utils/util';
import { takeIncludedComponents } from '../components/utils';
import { generateCustomCodeFile, hasCustomCode, takeReferencedFormulasAndActions, } from '../custom-code/codeRefs';
import { getServerToddleObject } from '../rendering/formulaContext';
import { removeTestData } from '../rendering/testData';
export const splitRoutes = ({ branchName, files, project, }) => {
    const filesMap = {};
    const stylesMap = {};
    const codeMap = {};
    const routes = {
        routes: { ...(files.routes ?? {}) },
        pages: {},
    };
    Object.entries(files.components).forEach(([name, component]) => {
        if (component) {
            // We try to provide a meaningful formula context here
            // but since we don't have a request at build time,
            // some data will be missing
            const formulaContext = {
                toddle: getServerToddleObject(files),
                env: {
                    isServer: true,
                    logErrors: false,
                    branchName: branchName,
                },
            };
            const usedAsWebComponent = toBoolean(applyFormula(component.customElement?.enabled, formulaContext));
            const isPage = isPageComponent(component);
            if (!isPage && !usedAsWebComponent) {
                // Skip components that are not used as web components or that are pages
                return;
            }
            if (isPage) {
                routes.pages[name] = {
                    name,
                    route: {
                        path: component.route.path,
                        query: component.route.query,
                    },
                };
            }
            const components = takeIncludedComponents({
                root: component,
                projectComponents: files.components,
                packages: files.packages,
                includeRoot: true,
            });
            const themes = files.themes ?? {
                defaultTheme: files.config?.theme ?? defaultTheme,
            };
            const styles = createStylesheet(component, components, themes, {
                // The reset stylesheet is loaded separately
                includeResetStyle: false,
                // Font faces are created from a stylesheet referenced in the head
                createFontFaces: false,
            });
            stylesMap[name] = styles;
            let customCode = false;
            let formulas = {};
            if (hasCustomCode(component, files)) {
                customCode = true;
                const code = takeReferencedFormulasAndActions({
                    component,
                    files,
                });
                const output = generateCustomCodeFile({
                    code,
                    componentName: component.name,
                    projectId: project.short_id,
                });
                codeMap[name] = output;
                formulas = filterObject(code.__PROJECT__.formulas, ([_, formula]) => 
                // custom formulas are not supported during SSR yet
                isToddleFormula(formula));
            }
            filesMap[name] = {
                customCode,
                config: files.config,
                themes: files.themes,
                components: Object.fromEntries(components.map((c) => [c.name, removeTestData(c)])),
                formulas,
                ...(files.packages
                    ? {
                        packages: mapObject(files.packages, ([key, pkg]) => [
                            key,
                            pkg
                                ? {
                                    ...pkg,
                                    components: mapObject(
                                    // Only include package components that are used by the page
                                    filterObject(pkg.components, ([_, pkgComponent]) => components.some((c) => pkgComponent &&
                                        c.name ===
                                            `${pkg.manifest.name}/${pkgComponent.name}`)), 
                                    // Remove test data from package components
                                    ([cKey, c]) => [cKey, c ? removeTestData(c) : c]),
                                    // Actions are not available during SSR
                                    actions: {},
                                    // TODO: Only include relevant formulas from packages
                                    formulas: filterObject(pkg.formulas ?? {}, ([_, pkgFormula]) => 
                                    // custom formulas are not supported during SSR yet
                                    isToddleFormula(pkgFormula)),
                                }
                                : undefined,
                        ]),
                    }
                    : undefined),
            };
        }
    });
    return {
        routes,
        files: filesMap,
        styles: stylesMap,
        code: codeMap,
        project: { project, config: files.config },
    };
};
//# sourceMappingURL=routes.js.map