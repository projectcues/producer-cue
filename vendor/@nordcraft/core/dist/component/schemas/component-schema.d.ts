import { z } from 'zod';
import type { Component, PageComponent } from '../component.types';
export declare const ComponentSchema: z.ZodType<Component>;
export declare const PageSchema: z.ZodType<PageComponent>;
export declare const ShallowComponentSchema: z.ZodType<Component>;
export declare const ShallowPageSchema: z.ZodType<PageComponent>;
