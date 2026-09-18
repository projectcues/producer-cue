/**
 * Somewhat convoluted function to calculate all possible drop insertion areas, as lines between elements.
 *
 * Drop locations follows the following rules:
 * - All lines for a single container are either horizontal or vertical (block or inline layout)
 * - If the next sibling of an element follows the expected layout (not wrapped) a line is drawn between the two (taking gap/margin into consideration),
 * - If the next sibling is wrapped, a line is drawn both after and before the next element. Both lines inserts the dragged element at the same index.
 */
export declare function getInsertAreas(): {
    layout: "block" | "inline";
    parent: Element;
    index: number;
    center: import("../types").Point;
    size: number;
    direction: -1 | 1;
    point: {
        x: number;
        y: number;
    };
}[];
