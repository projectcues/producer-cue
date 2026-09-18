import type { Component, ComponentData } from '@nordcraft/core/dist/component/component.types';
import { type ToddleEnv } from '@nordcraft/core/dist/formula/formula';
import { type Signal } from '../signal/signal';
export declare const getThemeSignal: (component: Component, dataSignal: Signal<ComponentData>, env: ToddleEnv) => Signal<string | null>;
