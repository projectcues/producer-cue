import type { Component } from '@nordcraft/core/dist/component/component.types';
import { ToddleComponent } from '@nordcraft/core/dist/component/ToddleComponent';
import type { PluginFormula } from '@nordcraft/core/dist/formula/formulaTypes';
import type { PluginAction, PluginActionV2 } from '@nordcraft/core/dist/types';
import type { ProjectFiles } from '../ssr.types';
export declare const getActionReferences: (component: ToddleComponent<string>) => Set<string>;
export declare function takeReferencedFormulasAndActions({ component, files }: {
    component: Component | undefined;
    files: ProjectFiles;
}): {
    __PROJECT__: {
        actions: Record<string, (PluginAction & {
            packageName?: string;
        }) | (PluginActionV2 & {
            packageName?: string;
        })>;
        formulas: Record<string, PluginFormula<string> & {
            packageName?: string;
        }>;
    };
    [packageName: string]: {
        actions: Record<string, PluginAction & {
            packageName?: string;
        }>;
        formulas: Record<string, PluginFormula<string> & {
            packageName?: string;
        }>;
    };
};
export declare const hasCustomCode: (component: Component, files: ProjectFiles) => boolean;
export declare const generateCustomCodeFile: ({ code, componentName, projectId, }: {
    code: {
        [packageName: string]: {
            actions: Record<string, PluginAction & {
                packageName?: string | undefined;
            }>;
            formulas: Record<string, PluginFormula<string> & {
                packageName?: string | undefined;
            }>;
        };
        __PROJECT__: {
            actions: Record<string, (PluginAction & {
                packageName?: string | undefined;
            }) | (PluginActionV2 & {
                packageName?: string | undefined;
            })>;
            formulas: Record<string, PluginFormula<string> & {
                packageName?: string | undefined;
            }>;
        };
    };
    componentName?: string | undefined;
    projectId: string;
}) => string;
