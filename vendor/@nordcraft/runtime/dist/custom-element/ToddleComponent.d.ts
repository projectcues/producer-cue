import type { Component, ComponentData } from '@nordcraft/core/dist/component/component.types';
import type { ToddleEnv } from '@nordcraft/core/dist/formula/formula';
import type { Theme } from '@nordcraft/core/dist/styling/theme';
import type { Toddle } from '@nordcraft/core/dist/types';
import type { Signal } from '../signal/signal';
import type { ComponentContext, LocationSignal } from '../types';
/**
 * Base class for all toddle components
 */
export declare class ToddleComponent extends HTMLElement {
    #private;
    /**
     * Public reference to the toddle instance for debugging purposes. `el.toddle.errors` can be used to check for non-verbose errors.
     */
    toddle: Toddle<LocationSignal, never>;
    constructor(component: Component, options: {
        components: Component[];
        themes: Record<string, Theme>;
    }, toddle: Toddle<LocationSignal, never>);
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispatch(eventName: string, data: any): void;
    render(): void;
    setAttribute(name: string, value: unknown): this;
    getAttribute<T>(name: string): string | NonNullable<T> | null;
    attributeChangedCallback(name: string, oldValue: never, newValue: string): void;
    private getAttributeCaseInsensitive;
    get __component(): Component;
    get __ctx(): ComponentContext;
    get __signal(): Signal<ComponentData>;
}
export declare const createSignal: ({ component, root, toddle, env, }: {
    component: Component;
    root: ShadowRoot;
    toddle: Toddle<LocationSignal, never>;
    env: ToddleEnv;
}) => Signal<ComponentData>;
