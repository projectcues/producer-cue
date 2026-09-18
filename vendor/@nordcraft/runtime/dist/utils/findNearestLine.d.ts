import type { Line, Point } from '../editor/types';
/**
 * Finds the nearest line to a given point from an array of lines.
 *
 * @param lines - An array of line segments defined by their endpoints.
 * @param point - The point to which the nearest line is to be found.
 * @returns The line segment nearest to the given point.
 */
export declare function findNearestLine(lines: Line[], point: Point): {
    nearestLine: Line | null;
    dist: number;
    projectionPoint: number;
};
