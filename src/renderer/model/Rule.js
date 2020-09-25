/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable no-cond-assign */
const str = '(((a > 2) && (b >= 3)) || c)'

const result = {
  type: 'apply',
  operator: { type: 'operator', name: '&&' },
  args: [
    {
      type: 'apply',
      operator: {
        type: 'operator', name: '>'
      },
      args: [
        {
          type: 'word', name: 'a'
        },
        {
          type: 'value', value: 2
        }
      ]
    },
    {
      type: 'apply',
      operator: {
        type: 'operator', name: '>='
      },
      args: [
        {
          type: 'word', name: 'b'
        },
        {
          type: 'value', value: 3
        }
      ]
    }
  ]
}

const str1 = '(a>3)'
console.log(parse(str))
function skipSpace (string) {
  const first = string.search(/\S/)
  if (first === -1) return ''
  return string.slice(first)
}
function parse (program) {
  const { expr, rest } = parseExpression(program)
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError('Unexpected text after program')
  }
  return expr
}

function parseExpression (program) {
  program = skipSpace(program)
  if (program[0] === '(') {
    const expr = {
      type: 'apply',
      operator: '',
      args: []
    }
    program = skipSpace(program.slice(1))
    while (program[0] !== ')') {
      const arg = parseExpression(program)
      if (arg.expr.type === 'operator') {
        expr.operator = arg.expr.operator
      } else {
        expr.args.push(arg.expr)
      }
      program = arg.rest
    }
    return { expr, rest: program.slice(1) }
  } else {
    return parseArg(program)
  }
}
function parseArg (program) {
  program = skipSpace(program)
  let match, expr
  if ((match = /^\d{1,}[.]?\d?/.exec(program))) {
    expr = { type: 'value', value: parseFloat(match[0]) }
  } else if ((match = /^([><=]=?|&&|\|\|)/.exec(program))) {
    expr = {
      type: 'operator',
      operator: match[0]
    }
  } else if ((match = /^\w+/.exec(program))) {
    expr = {
      type: 'word',
      name: match[0]
    }
  } else {
    throw new SyntaxError('Unexpect syntax :' + program)
  }
  return { expr, rest: program.slice(match[0].length) }
}
