import type { Component, ComponentData, ElementNodeModel } from '@nordcraft/core/dist/component/component.types';
import type { FormulaContext, ToddleEnv } from '@nordcraft/core/dist/formula/formula';
export declare const escapeAttrValue: (value: any) => string;
/**
 * Escape a string to valid HTML text similar to how set innerText would work in the browser
 */
export declare const toEncodedText: (str: string) => string;
export declare function getNodeAttrs({ node, data, component, packageName, env, toddle }: {
    node: Pick<ElementNodeModel, 'attrs' | 'style-variables'>;
    data: ComponentData;
    component: Component;
    packageName: string | undefined;
    env: ToddleEnv;
    toddle: FormulaContext['toddle'];
}): string[];
