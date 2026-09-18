import type { Component, ComponentData } from '@nordcraft/core/dist/component/component.types';
import type { Signal } from '../signal/signal';
import type { ComponentContext } from '../types';
export declare function subscribeToContext(componentDataSignal: Signal<ComponentData>, component: Component, ctx: ComponentContext): void;
