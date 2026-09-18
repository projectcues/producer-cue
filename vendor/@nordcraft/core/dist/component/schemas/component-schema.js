import { z } from 'zod';
import { ActionModelSchema } from './action-schema.js';
import { ComponentAPISchema } from './api-schema.js';
import { ComponentAttributeSchema } from './attribute-schema.js';
import { ComponentContextSchema } from './context-schema.js';
import { ComponentEventSchema } from './event-schema.js';
import { ComponentFormulaSchema } from './formula-schema.js';
import { NodeModelSchema } from './node-schema.js';
import { RouteSchema } from './route-schema.js';
import { ComponentVariableSchema } from './variable-schema.js';
import { ComponentWorkflowSchema } from './workflow-schema.js';
import { SCHEMA_DESCRIPTIONS } from './zod-schemas.js';
const commonComponentSchema = (type) => z
    .object({
    name: z.string().describe(`Name of the ${type}`),
    exported: z
        .boolean()
        .nullish()
        .describe(`Whether the ${type} is exported in a package project for use in other projects. Do not change this value. It should be managed by the user.`),
    nodes: z
        .record(z.string(), NodeModelSchema)
        .nullish()
        .describe(`All nodes in the ${type}, indexed by their unique IDs. Nodes represent HTML elements, text, slots, or ${type === 'component' ? 'other components' : 'components'}. They defined the UI structure of the ${type}.`),
    variables: z
        .record(z.string(), ComponentVariableSchema)
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.variables(type)),
    formulas: z
        .record(z.string(), ComponentFormulaSchema)
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.formulas(type)),
    workflows: z
        .record(z.string(), ComponentWorkflowSchema)
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.workflows(type)),
    apis: z
        .record(z.string(), ComponentAPISchema)
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.apis(type)),
    events: z
        .array(ComponentEventSchema)
        .nullish()
        .describe('All events this the component can emit. Events allow the component to communicate with its parent or other components. They can be triggered via actions.'),
    contexts: z
        .record(z.string(), ComponentContextSchema)
        .nullish()
        .describe('Defines which contexts this component is subscribed to. Contexts allow the component to access formulas and workflows from other components, enabling reusability and modular design.'),
    onLoad: z
        .object({
        trigger: z.literal('Load'),
        actions: z.array(ActionModelSchema),
    })
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.onLoad(type)),
    onAttributeChange: z
        .object({
        trigger: z.literal('Attribute change'),
        actions: z.array(ActionModelSchema),
    })
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.onAttributeChange(type)),
})
    .describe('Schema defining a reusable Nordcraft component.');
export const ComponentSchema = commonComponentSchema('component').extend({
    attributes: z
        .record(z.string(), ComponentAttributeSchema)
        .nullish()
        .describe('All attributes that can be passed into the component when it is used. Attributes allow for customization and configuration of the component instance. When the value of an attribute changes, any formulas depending on it will automatically recalculate and the onAttributeChange lifecycle event is triggered.'),
});
export const PageSchema = commonComponentSchema('page').extend({
    attributes: z
        .object({})
        .nullish()
        .describe('Attributes for the page (currently none). Should always be an empty object.'),
    route: RouteSchema.describe('Route information for the page, including path segments, query parameters, and metadata such as title and description.'),
});
const shallowCommonComponentSchema = (type) => z
    .object({
    name: z.string().describe(`Name of the ${type}`),
    exported: z
        .boolean()
        .nullish()
        .describe(`Whether the ${type} is exported in a package project for use in other projects. Do not change this value. It should be managed by the user.`),
    nodes: z
        .record(z.string(), z.any())
        .nullish()
        .describe(`All nodes in the ${type}, indexed by their unique IDs. Nodes represent HTML elements, text, slots, or ${type === 'component' ? 'other components' : 'components'}. They defined the UI structure of the ${type}.`),
    variables: z
        .record(z.string(), z.any())
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.variables(type)),
    formulas: z
        .record(z.string(), z.any())
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.formulas(type)),
    workflows: z
        .record(z.string(), z.any())
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.workflows(type)),
    apis: z
        .record(z.string(), z.any())
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.apis(type)),
    events: z
        .array(z.any())
        .nullish()
        .describe('All events this the component can emit. Events allow the component to communicate with its parent or other components. They can be triggered via actions.'),
    contexts: z
        .record(z.string(), z.any())
        .nullish()
        .describe('Defines which contexts this component is subscribed to. Contexts allow the component to access formulas and workflows from other components, enabling reusability and modular design.'),
    onLoad: z.any().nullish().describe(SCHEMA_DESCRIPTIONS.onLoad(type)),
    onAttributeChange: z
        .any()
        .nullish()
        .describe(SCHEMA_DESCRIPTIONS.onAttributeChange(type)),
})
    .describe('Schema defining a reusable Nordcraft component.');
export const ShallowComponentSchema = shallowCommonComponentSchema('component').extend({
    attributes: z
        .record(z.string(), z.any())
        .nullish()
        .describe('All attributes that can be passed into the component when it is used. Attributes allow for customization and configuration of the component instance. When the value of an attribute changes, any formulas depending on it will automatically recalculate and the onAttributeChange lifecycle event is triggered.'),
});
export const ShallowPageSchema = shallowCommonComponentSchema('page').extend({
    attributes: z
        .any()
        .nullish()
        .describe('Attributes for the page (currently none). Should always be an empty object.'),
    route: RouteSchema.describe('Route information for the page, including path segments, query parameters, and metadata such as title and description.'),
});
//# sourceMappingURL=component-schema.js.map