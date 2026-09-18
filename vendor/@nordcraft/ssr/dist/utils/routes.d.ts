import type { RouteDeclaration } from '@nordcraft/core/dist/component/component.types';
import type { ProjectFiles, Route, ToddleProject } from '../ssr.types';
export interface Routes {
    pages: Record<string, {
        name: string;
        route: RouteDeclaration;
    }>;
    routes: Record<string, Route>;
}
export type ProjectFilesWithCustomCode = ProjectFiles & {
    customCode: boolean;
};
export type Files = Record<string, ProjectFilesWithCustomCode>;
export type ProjectWithConfig = {
    project: ToddleProject;
    config: ProjectFiles['config'];
};
export declare const splitRoutes: ({ branchName, files, project, }: {
    branchName: string;
    files: ProjectFiles;
    project: ToddleProject;
}) => {
    project: ProjectWithConfig;
    routes: Routes;
    files: Files;
    styles: Record<string, string>;
    code: Record<string, string>;
};
