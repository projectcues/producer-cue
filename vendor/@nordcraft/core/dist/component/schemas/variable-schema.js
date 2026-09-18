import { z } from 'zod';
import { FormulaSchema } from './formula-schema.js';
import { MetadataSchema, SCHEMA_DESCRIPTIONS } from './zod-schemas.js';
export const ComponentVariableSchema = z.object({
    '@nordcraft/metadata': MetadataSchema.nullish().describe(SCHEMA_DESCRIPTIONS.metadata('variable')),
    initialValue: FormulaSchema.describe('Initial value of the variable'),
});
//# sourceMappingURL=variable-schema.js.map