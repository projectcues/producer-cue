import { z } from 'zod';
import { MetadataSchema, SCHEMA_DESCRIPTIONS } from './zod-schemas.js';
export const ComponentAttributeSchema = z
    .object({
    '@nordcraft/metadata': MetadataSchema.nullish().describe(SCHEMA_DESCRIPTIONS.metadata('component attribute')),
    name: z.string().describe('Name of the component attribute'),
    testValue: z
        .any()
        .describe(SCHEMA_DESCRIPTIONS.testData('component attribute')),
})
    .describe('Schema for a component attribute.');
//# sourceMappingURL=attribute-schema.js.map