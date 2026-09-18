export declare class Signal<T> {
    value: T;
    subscribers: Set<{
        notify: (value: T) => void;
        destroy?: () => void;
    }>;
    subscriptions: Array<() => void>;
    destroying: boolean;
    constructor(value: T);
    get(): T;
    set(value: T): void;
    update(f: (current: T) => T): void;
    subscribe(notify: (value: T) => void, config?: {
        destroy?: () => void;
    }): () => void;
    destroy(): void;
    cleanSubscribers(): void;
    map<T2>(f: (value: T) => T2): Signal<T2>;
}
export declare function signal<T>(value: T): Signal<T>;
