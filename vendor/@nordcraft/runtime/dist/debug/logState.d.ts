import type { Component, ComponentData } from '@nordcraft/core/dist/component/component.types';
import type { Signal } from '../signal/signal';
export declare function initLogState(): void;
export declare function registerComponentToLogState(component: Component, dataSignal: Signal<ComponentData>): void;
