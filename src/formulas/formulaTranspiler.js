import { parseExpression } from './expressionParser.js'

export function astToFormula(ast, context = {}) {
  switch (ast.type) {
    case 'Literal':
      return {
        type: 'value',
        value: ast.value,
      }

    case 'Identifier': {
      const name = ast.name
      if (context.attributes?.includes(name)) {
        return { type: 'path', path: ['Attributes', name] }
      }
      if (context.variables?.includes(name)) {
        return { type: 'path', path: ['Variables', name] }
      }
      if (['Variables', 'Attributes', 'Apis', 'Args', 'Parameters', 'URL parameters'].includes(name)) {
        return { type: 'path', path: [name] }
      }
      return { type: 'path', path: ['Variables', name] }
    }

    case 'Path': {
      let base = ast.base
      if (context.attributes?.includes(base)) {
        return { type: 'path', path: ['Attributes', base, ...ast.path] }
      }
      if (context.variables?.includes(base)) {
        return { type: 'path', path: ['Variables', base, ...ast.path] }
      }
      if (!['Variables', 'Attributes', 'Apis', 'Args', 'Parameters', 'URL parameters'].includes(base)) {
        base = 'Variables'
        return { type: 'path', path: [base, ast.base, ...ast.path] }
      }
      return { type: 'path', path: [base, ...ast.path] }
    }

    case 'Binary': {
      const leftFormula = astToFormula(ast.left, context)
      const rightFormula = astToFormula(ast.right, context)

      if (ast.operator === '&&') {
        return {
          type: 'and',
          arguments: [{ formula: leftFormula }, { formula: rightFormula }],
        }
      }

      if (ast.operator === '||') {
        return {
          type: 'or',
          arguments: [{ formula: leftFormula }, { formula: rightFormula }],
        }
      }

      const opMap = {
        '+': { name: '@toddle/add', display_name: 'Add' },
        '-': { name: '@toddle/minus', display_name: 'Minus' },
        '*': { name: '@toddle/multiply', display_name: 'Multiply' },
        '/': { name: '@toddle/divide', display_name: 'Divide' },
        '%': { name: '@toddle/modulo', display_name: 'Modulo' },
        '==': { name: '@toddle/equals', display_name: 'Equals' },
        '===': { name: '@toddle/equals', display_name: 'Equals' },
        '!=': { name: '@toddle/notEqual', display_name: 'Not equal' },
        '!==': { name: '@toddle/notEqual', display_name: 'Not equal' },
        '>': { name: '@toddle/greaterThan', display_name: 'Greater than' },
        '>=': { name: '@toddle/greaterOrEqueal', display_name: 'Greater or equal' },
        '<': { name: '@toddle/lessThan', display_name: 'Less than' },
        '<=': { name: '@toddle/lessOrEqual', display_name: 'Less or equal' },
      }

      const target = opMap[ast.operator]
      if (!target) {
        throw new Error(`Unsupported binary operator: ${ast.operator}`)
      }

      return {
        type: 'function',
        name: target.name,
        display_name: target.display_name,
        arguments: [
          { name: '0', formula: leftFormula },
          { name: '1', formula: rightFormula },
        ],
        variableArguments: true,
      }
    }

    case 'Unary': {
      const argFormula = astToFormula(ast.argument, context)
      if (ast.operator === '!') {
        return {
          type: 'function',
          name: '@toddle/not',
          display_name: 'Not',
          arguments: [{ name: 'Input', formula: argFormula }],
        }
      }
      if (ast.operator === '-') {
        return {
          type: 'function',
          name: '@toddle/minus',
          display_name: 'Minus',
          arguments: [
            { name: 'Minuend', formula: { type: 'value', value: 0 } },
            { name: 'Substrahend', formula: argFormula },
          ],
        }
      }
      throw new Error(`Unsupported unary operator: ${ast.operator}`)
    }

    case 'Ternary': {
      const condFormula = astToFormula(ast.condition, context)
      const thenFormula = astToFormula(ast.consequent, context)
      const elseFormula = astToFormula(ast.alternate, context)

      return {
        type: 'switch',
        cases: [
          {
            condition: condFormula,
            formula: thenFormula,
          },
        ],
        default: elseFormula,
      }
    }

    case 'Call': {
      const callee = ast.callee
      const args = ast.arguments.map((a, idx) => ({
        name: String(idx),
        formula: astToFormula(a, context),
      }))

      if (callee === 'concat' || callee === 'concatenate') {
        return {
          type: 'function',
          name: '@toddle/concatenate',
          display_name: 'Concatenate',
          arguments: args,
          variableArguments: true,
        }
      }

      if (callee === 'now') {
        return {
          type: 'function',
          name: '@toddle/now',
          display_name: 'Now',
          arguments: [],
        }
      }

      const functionName = callee.startsWith('@') ? callee : `@toddle/${callee}`
      return {
        type: 'function',
        name: functionName,
        display_name: callee.charAt(0).toUpperCase() + callee.slice(1),
        arguments: args,
        variableArguments: true,
      }
    }
  }
}

export function compileExpression(expr, context = {}) {
  if (typeof expr !== 'string') {
    return { type: 'value', value: expr }
  }
  const ast = parseExpression(expr.trim())
  return astToFormula(ast, context)
}

export function decompileFormula(formula) {
  if (!formula || typeof formula !== 'object') {
    return String(formula)
  }

  if (formula.type === 'value') {
    if (typeof formula.value === 'string') {
      return `"${formula.value}"`
    }
    return String(formula.value)
  }

  if (formula.type === 'path') {
    return (formula.path || []).join('.')
  }

  if (formula.type === 'and') {
    const sub = (formula.arguments || []).map((a) => decompileFormula(a.formula))
    return `(${sub.join(' && ')})`
  }

  if (formula.type === 'or') {
    const sub = (formula.arguments || []).map((a) => decompileFormula(a.formula))
    return `(${sub.join(' || ')})`
  }

  if (formula.type === 'switch') {
    const firstCase = formula.cases?.[0]
    if (firstCase) {
      const cond = decompileFormula(firstCase.condition)
      const thenExpr = decompileFormula(firstCase.formula)
      const elseExpr = decompileFormula(formula.default)
      return `${cond} ? ${thenExpr} : ${elseExpr}`
    }
  }

  if (formula.type === 'function') {
    const fnName = formula.name.replace(/^@toddle\//, '')
    const args = (formula.arguments || []).map((a) => decompileFormula(a.formula))

    const infixMap = {
      add: '+',
      minus: '-',
      multiply: '*',
      divide: '/',
      modulo: '%',
      equals: '==',
      notEqual: '!=',
      greaterThan: '>',
      greaterOrEqueal: '>=',
      lessThan: '<',
      lessOrEqual: '<=',
    }

    if (infixMap[fnName] && args.length === 2) {
      return `${args[0]} ${infixMap[fnName]} ${args[1]}`
    }

    if (fnName === 'not' && args.length === 1) {
      return `!(${args[0]})`
    }

    return `${fnName}(${args.join(', ')})`
  }

  return JSON.stringify(formula)
}
