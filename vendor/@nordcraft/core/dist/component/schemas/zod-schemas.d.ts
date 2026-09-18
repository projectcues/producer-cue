import { z } from 'zod';
export declare const SCHEMA_DESCRIPTIONS: {
    animations: (type: string) => string;
    animationKey: string;
    animationKeyframeKey: string;
    apis: (type: string) => string;
    children: string;
    condition: (type: string) => string;
    formulas: (type: string) => string;
    metadata: (type: string) => string;
    onAttributeChange: (type: string) => string;
    onLoad: (type: string) => string;
    repeat: (type: string) => string;
    repeatKey: (type: string) => string;
    slot: (type: string) => string;
    style: (type: string) => string;
    testData: (type: string) => string;
    variables: (type: string) => string;
    variants: (type: string) => string;
    workflows: (type: string) => string;
};
export declare const MetadataSchema: z.ZodOptional<z.ZodNullable<z.ZodObject<{
    comments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodObject<{
        index: z.ZodNumber;
        text: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>>>;
