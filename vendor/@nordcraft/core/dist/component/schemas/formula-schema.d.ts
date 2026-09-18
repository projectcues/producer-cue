import { z } from 'zod';
import type { Formula } from '../../formula/formula';
import type { ComponentFormula } from '../component.types';
export declare const FormulaSchema: z.ZodType<Formula>;
export declare const ComponentFormulaSchema: z.ZodType<ComponentFormula>;
