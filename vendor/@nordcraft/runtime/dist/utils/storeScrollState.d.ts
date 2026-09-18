export declare const storeScrollState: (key?: string, querySelector?: string, comparerFn?: (node: Element) => string | null) => (selectorFn: (id: string) => HTMLElement | null) => void;
export declare const getScrollStateRestorer: (key: string) => (selectorFn: (id: string) => HTMLElement | null) => void;
