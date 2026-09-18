import { describe, expect, test } from 'bun:test';
import { evaluateResponseHeaders } from './response';
describe('evaluateResponseHeaders', () => {
    const mockFormulaContext = {
        data: {
            Page: {
                Theme: 'dark',
            },
        },
        reportFormulaEvaluation: () => { },
    };
    test('it returns an empty object if responseHeaders is null', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: null,
        })).toEqual({});
    });
    test('it returns an empty object if responseHeaders is empty', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: {},
        })).toEqual({});
    });
    test('it evaluates static string headers', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: {
                'X-Custom-Header': 'static-value',
            },
        })).toEqual({
            'X-Custom-Header': 'static-value',
        });
    });
    test('it evaluates formula headers', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: {
                'X-Theme': {
                    type: 'path',
                    path: ['Page', 'Theme'],
                },
                'X-Static': 'value',
            },
        })).toEqual({
            'X-Theme': 'dark',
            'X-Static': 'value',
        });
    });
    test('it returns an empty object if responseHeaders is undefined', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: undefined,
        })).toEqual({});
    });
    test('it ignores formula headers that do not evaluate to a string', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: {
                'X-Not-A-String': {
                    type: 'value',
                    value: 123,
                },
            },
        })).toEqual({});
    });
    test('it ignores non-string and non-formula values', () => {
        expect(evaluateResponseHeaders({
            formulaContext: mockFormulaContext,
            responseHeaders: {
                'X-Invalid': 123,
            },
        })).toEqual({});
    });
});
//# sourceMappingURL=response.test.js.map