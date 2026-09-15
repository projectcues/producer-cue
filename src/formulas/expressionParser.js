/**
 * Lightweight Expression Tokenizer & Parser for Natural AI-Generated Logic
 */

export function tokenize(input) {
  const tokens = []
  let i = 0
  const len = input.length

  while (i < len) {
    const ch = input[i]

    if (/\s/.test(ch)) {
      i++
      continue
    }

    if (/\d/.test(ch)) {
      let numStr = ''
      while (i < len && /[\d.]/.test(input[i])) {
        numStr += input[i]
        i++
      }
      tokens.push({ type: 'NUMBER', value: numStr, raw: Number(numStr) })
      continue
    }

    if (ch === '"' || ch === "'") {
      const quote = ch
      i++
      let str = ''
      while (i < len && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < len) {
          i++
          str += input[i]
        } else {
          str += input[i]
        }
        i++
      }
      i++
      tokens.push({ type: 'STRING', value: str, raw: str })
      continue
    }

    const twoChar = input.slice(i, i + 2)
    const threeChar = input.slice(i, i + 3)
    if (threeChar === '===' || threeChar === '!==') {
      tokens.push({ type: 'OPERATOR', value: threeChar })
      i += 3
      continue
    }
    if (
      twoChar === '==' ||
      twoChar === '!=' ||
      twoChar === '<=' ||
      twoChar === '>=' ||
      twoChar === '&&' ||
      twoChar === '||'
    ) {
      tokens.push({ type: 'OPERATOR', value: twoChar })
      i += 2
      continue
    }

    if (['+', '-', '*', '/', '%', '<', '>', '!', '?', ':'].includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch })
      i++
      continue
    }

    if (['(', ')', '[', ']', '{', '}', ',', '.'].includes(ch)) {
      tokens.push({ type: 'PUNCTUATION', value: ch })
      i++
      continue
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let ident = ''
      while (i < len && /[a-zA-Z0-9_$-]/.test(input[i])) {
        ident += input[i]
        i++
      }
      if (ident === 'true' || ident === 'false') {
        tokens.push({ type: 'BOOLEAN', value: ident, raw: ident === 'true' })
      } else if (ident === 'null') {
        tokens.push({ type: 'NULL', value: 'null', raw: null })
      } else {
        tokens.push({ type: 'IDENTIFIER', value: ident })
      }
      continue
    }

    i++
  }

  tokens.push({ type: 'EOF', value: '' })
  return tokens
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }

  peek() {
    return this.tokens[this.pos] || { type: 'EOF', value: '' }
  }

  next() {
    const t = this.peek()
    this.pos++
    return t
  }

  match(type, value) {
    const t = this.peek()
    if (t.type === type && (value === undefined || t.value === value)) {
      this.pos++
      return true
    }
    return false
  }

  parse() {
    return this.parseTernary()
  }

  parseTernary() {
    let expr = this.parseLogicalOr()
    if (this.match('OPERATOR', '?')) {
      const consequent = this.parseTernary()
      if (!this.match('OPERATOR', ':')) {
        throw new Error('Expected ":" in ternary expression')
      }
      const alternate = this.parseTernary()
      expr = { type: 'Ternary', condition: expr, consequent, alternate }
    }
    return expr
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd()
    while (this.match('OPERATOR', '||')) {
      const right = this.parseLogicalAnd()
      left = { type: 'Binary', operator: '||', left, right }
    }
    return left
  }

  parseLogicalAnd() {
    let left = this.parseEquality()
    while (this.match('OPERATOR', '&&')) {
      const right = this.parseEquality()
      left = { type: 'Binary', operator: '&&', left, right }
    }
    return left
  }

  parseEquality() {
    let left = this.parseRelational()
    while (
      this.peek().type === 'OPERATOR' &&
      ['==', '===', '!=', '!=='].includes(this.peek().value)
    ) {
      const op = this.next().value
      const right = this.parseRelational()
      left = { type: 'Binary', operator: op, left, right }
    }
    return left
  }

  parseRelational() {
    let left = this.parseAdditive()
    while (
      this.peek().type === 'OPERATOR' &&
      ['<', '<=', '>', '>='].includes(this.peek().value)
    ) {
      const op = this.next().value
      const right = this.parseAdditive()
      left = { type: 'Binary', operator: op, left, right }
    }
    return left
  }

  parseAdditive() {
    let left = this.parseMultiplicative()
    while (
      this.peek().type === 'OPERATOR' &&
      ['+', '-'].includes(this.peek().value)
    ) {
      const op = this.next().value
      const right = this.parseMultiplicative()
      left = { type: 'Binary', operator: op, left, right }
    }
    return left
  }

  parseMultiplicative() {
    let left = this.parseUnary()
    while (
      this.peek().type === 'OPERATOR' &&
      ['*', '/', '%'].includes(this.peek().value)
    ) {
      const op = this.next().value
      const right = this.parseUnary()
      left = { type: 'Binary', operator: op, left, right }
    }
    return left
  }

  parseUnary() {
    if (this.peek().type === 'OPERATOR' && ['!', '-'].includes(this.peek().value)) {
      const op = this.next().value
      const argument = this.parseUnary()
      return { type: 'Unary', operator: op, argument }
    }
    return this.parsePrimary()
  }

  parsePrimary() {
    const token = this.peek()

    if (token.type === 'NUMBER' || token.type === 'STRING' || token.type === 'BOOLEAN' || token.type === 'NULL') {
      this.next()
      return { type: 'Literal', value: token.raw }
    }

    if (this.match('PUNCTUATION', '(')) {
      const expr = this.parseTernary()
      if (!this.match('PUNCTUATION', ')')) {
        throw new Error('Expected closing parenthesis ")"')
      }
      return expr
    }

    if (token.type === 'IDENTIFIER') {
      this.next()
      if (this.match('PUNCTUATION', '(')) {
        const args = []
        if (!this.match('PUNCTUATION', ')')) {
          do {
            args.push(this.parseTernary())
          } while (this.match('PUNCTUATION', ','))
          if (!this.match('PUNCTUATION', ')')) {
            throw new Error('Expected ")" after function arguments')
          }
        }
        return { type: 'Call', callee: token.value, arguments: args }
      }

      const pathSegments = []
      while (this.match('PUNCTUATION', '.')) {
        const seg = this.peek()
        if (seg.type === 'IDENTIFIER') {
          pathSegments.push(seg.value)
          this.next()
        }
      }

      if (pathSegments.length > 0) {
        return { type: 'Path', base: token.value, path: pathSegments }
      }

      return { type: 'Identifier', name: token.value }
    }

    throw new Error(`Unexpected token at position ${this.pos}: "${token.value}"`)
  }
}

export function parseExpression(input) {
  const tokens = tokenize(input)
  const parser = new Parser(tokens)
  return parser.parse()
}
