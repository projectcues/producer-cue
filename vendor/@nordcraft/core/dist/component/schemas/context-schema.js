import { z } from 'zod';
export const ComponentContextSchema = z
    .object({
    package: z
        .string()
        .nullish()
        .describe('Package name of the component providing the context'),
    componentName: z
        .string()
        .nullish()
        .describe('Name of the component providing the context'),
    formulas: z
        .array(z.string())
        .describe('Names of the formulas from the context to subscribe to'),
    workflows: z
        .array(z.string())
        .describe('Names of the workflows from the context to subscribe to'),
})
    .describe('Schema defining a component context subscription.');
//# sourceMappingURL=context-schema.js.map