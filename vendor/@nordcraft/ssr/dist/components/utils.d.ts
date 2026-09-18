import type { Component } from '@nordcraft/core/dist/component/component.types';
import type { Nullable } from '@nordcraft/core/dist/types';
import type { ProjectFiles } from '../ssr.types';
export declare function takeIncludedComponents({ root, projectComponents, packages, includeRoot }: {
    projectComponents: ProjectFiles['components'];
    packages: ProjectFiles['packages'];
    root: Component;
    includeRoot?: Nullable<boolean>;
}): Component[];
