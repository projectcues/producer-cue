import fastDeepEqual from 'fast-deep-equal';
export class Signal {
    value;
    subscribers;
    subscriptions;
    destroying = false;
    constructor(value) {
        this.value = value;
        this.subscribers = new Set();
        this.subscriptions = [];
    }
    get() {
        return this.value;
    }
    set(value) {
        // Short circuit and skip expensive `deepEqual` if there are not currently any subscribers
        if (this.subscribers.size === 0) {
            this.value = value;
            return;
        }
        if (fastDeepEqual(value, this.value) === false) {
            this.value = value;
            for (const subscriber of this.subscribers) {
                subscriber.notify(this.value);
            }
        }
    }
    update(f) {
        this.set(f(this.value));
    }
    subscribe(notify, config) {
        const subscriber = { notify, destroy: config?.destroy };
        this.subscribers.add(subscriber);
        notify(this.value);
        return () => {
            this.subscribers.delete(subscriber);
        };
    }
    destroy() {
        // Prevent re-entrancy
        if (this.destroying) {
            return;
        }
        this.destroying = true;
        for (const subscriber of this.subscribers) {
            subscriber.destroy?.();
        }
        this.subscribers.clear();
        for (const subscription of this.subscriptions) {
            subscription();
        }
        this.subscriptions.splice(0, this.subscriptions.length);
        this.destroying = false;
    }
    cleanSubscribers() {
        for (const subscriber of this.subscribers) {
            subscriber.destroy?.();
        }
        this.subscribers.clear();
    }
    map(f) {
        const signal2 = signal(f(this.value));
        signal2.subscriptions.push(this.subscribe((value) => signal2.set(f(value)), {
            destroy: () => signal2.destroy(),
        }));
        return signal2;
    }
}
export function signal(value) {
    return new Signal(value);
}
if (typeof window !== 'undefined') {
    ;
    window.signal = signal;
    window.deepEqual = fastDeepEqual;
}
//# sourceMappingURL=signal.js.map