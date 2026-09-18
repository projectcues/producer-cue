import type { PageComponent } from '@nordcraft/core/dist/component/component.types';
import { HeadTagTypes } from '@nordcraft/core/dist/component/component.types';
import type { FormulaContext } from '@nordcraft/core/dist/formula/formula';
import type { OldTheme, Theme } from '@nordcraft/core/dist/styling/theme';
import type { ProjectFiles, ToddleProject } from '../ssr.types';
type Text = string;
export type HeadItemType = `${HeadTagTypes}:${Text}` | 'title';
/**
 * Returns all head items for a given page
 */
export declare const getHeadItems: ({ cacheBuster, context, cssBasePath, page, resetStylesheetPath, pageStylesheetPath, files, project, themes, url, customProperties, }: {
    cacheBuster?: string | undefined;
    context: FormulaContext;
    cssBasePath?: string | undefined;
    files: ProjectFiles;
    page: PageComponent;
    resetStylesheetPath?: string | undefined;
    pageStylesheetPath?: string | undefined;
    project: ToddleProject;
    themes: Record<string, OldTheme | Theme>;
    url: URL;
    customProperties: readonly string[];
}) => Map<HeadItemType, string>;
export declare const renderHeadItems: ({ headItems, ordering, }: {
    headItems: Map<string, string>;
    ordering?: string[] | undefined;
}) => string;
export declare const defaultHeadOrdering: HeadItemType[];
export {};
