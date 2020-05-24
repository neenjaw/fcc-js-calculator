/*
Stack helper functions
*/

const peek = (arr) => arr[arr.length - 1]

const isEmpty = (arr) => arr.length === 0

/*
helper function
*/

const pushToken = (arr, token) => {
  arr.push(token)
  return arr;
}

/*
calculator constants
*/

const operators = {
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/'
}

/*
calculator functions
*/

const isOperator  = (token) => {
  switch (token) {
    case operators.PLUS:
      return true
    case operators.MINUS:
      return true
    case operators.MULTIPLY:
      return true
    case operators.DIVIDE:
      return true
    default:
      return false
  }
}

const tokenizer = (formula) => {
  return formula.match(/\d+|\+|-|\/|\*|\(|\)/g) ?? []
}

const convertNumericTokens = tokens => tokens.map(token => {
  if (isNaN(Number(token))) {
    return token
  } else {
    return Number(token)
  }
})

/*
This takes an array of tokens, and looks for situations to apply a negative (-) symbol to a following number
*/
const attributeNegatives = (tokens) => {
  return tokens.reduce((accTokens, token, idx, tokens) => {
    // if current token is a number and the last accToken doesn't match the previous token it means
    // that a (-) was removed from the token list because it should be attributed to this number
    if ((typeof token === 'number') && (tokens[idx-1]) !== accTokens[accTokens.length - 1]) {
      return pushToken(accTokens, token * -1)
    }

    if (token !== operators.MINUS) {
      return pushToken(accTokens, token)
    }

    // current token is operators.MINUS
    const firstToken = idx == 0
    const lastTokenWasOperator = firstToken || isOperator(tokens[idx - 1])
    const nextTokenIsNumber = (typeof tokens[idx+1] === 'number')

    if ((firstToken || lastTokenWasOperator) && nextTokenIsNumber) {
      return accTokens
    } else {
      return pushToken(accTokens, token)
    }
  }, [])
}

const applyOnlyLastOp = (tokens) => {
  return tokens.filter((token, idx, tokens) => {
    return !(isOperator(token) && isOperator(tokens[idx + 1]))
  }, [])
}

const normalizeTokenizedFormula = (tokens) => {
  let firstIndex = 0
  let lastIndex = tokens.length - 1

  while(isOperator(tokens[firstIndex])) {
    firstIndex += 1
  }
  while(isOperator(tokens[lastIndex])) {
    lastIndex -= 1
  }

  const normalized = []
  for (let index = firstIndex; index <= lastIndex; index++) {
    normalized.push(tokens[index]);
  }
  return normalized
}

const calculate = (formula) => {
  const tokenized = tokenizer(formula)
  const converted = convertNumericTokens(tokenized)
  const attributed = attributeNegatives(converted)
  const applied = applyOnlyLastOp(attributed)
  const normalized = normalizeTokenizedFormula(applied)

  if (normalized === false)
    return 'ERR'

  // Implementation of dijkstra's shunting yard algorithm
  const values = []
  const ops = []

  for (let idx = 0; idx < normalized.length; idx++) {
    const token = normalized[idx];

    if (typeof token === 'number') {
      values.push(token)
      continue
    }

    if (token === '(') {
      ops.push(token)
      continue
    }

    if (token === ')') {
      while(peek(ops) !== '(') {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()))
      }
      ops.pop()
      continue
    }

    if (isOperator(token)) {
      while(!isEmpty(ops) && hasPrecedence(token, peek(ops))) {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()))
      }

      ops.push(token)
      continue
    }
  }

  while (!isEmpty(ops)) {
    values.push(applyOp(ops.pop(), values.pop(), values.pop()));
  }

  const result = values.pop()

  return result;
}

const applyOp = (op, b, a) => {
  // console.log({type: 'apply', b, a})
  switch (op) {
    case operators.PLUS:
      return a + b;
    case operators.MINUS:
      return a - b;
    case operators.MULTIPLY:
      return a * b;
    case operators.DIVIDE:
      if (b === 0) throw "Division by zero."
      return a / b;
    default:
      throw "Unsupported operation."
  }
}

const hasPrecedence = (opA, opB) => {
  if (opB === '(' || opB === ')') return false;
  if ((opA === '*' || opA === '/') && (opB === '+' || opB === '-')) return false;

  return true
}
