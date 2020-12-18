const assert = require('assert')
const input = require('fs').readFileSync('18.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const testCases = [
  { expression: '1 + 2 * 3 + 4 * 5 + 6', expected: 71 },
  { expression: '1 + (2 * 3) + (4 * (5 + 6))', expected: 51 },
  { expression: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', expected: 12240 },
]

const parseExpression = expression => {
  // First version: [...expression.matchAll(/(\d+|\([^)]+\)|[+*])(\s+|$)/g)].map(m => m[0].trim())
  // failed because javascript don't have PCRE recursive regexps

  let tokens = []
  let index = 0
  while (index < expression.length) {
    const reminder = expression.substring(index)
    const matches = [...reminder.matchAll(/^(\d+|[+*])\s*/)].map(m => m[0])
    if (matches.length === 1) {
      tokens.push(matches[0].trim())
      index += matches[0].length
      continue
    }
    if (!reminder.startsWith('(')) {
      debugger
      throw new Error(`Error parsing ${expression}`)
    }
    let parenCount = 1
    for (let idx = 1; idx < reminder.length; idx++) {
      if (reminder[idx] === ')') {
        parenCount--
        if (parenCount === 0) {
          index += idx + 1
          tokens.push(reminder.substring(0, idx + 1))
          while (expression[index] === ' ') index++
          break
        }
      }
      if (reminder[idx] === '(') {
        parenCount++
      }
    }
    if (parenCount > 0) {
      throw new Error(`Unbalanced params in ${expression}`)
    }
  }

  return tokens
}

const stripParams = expression => expression.replace(/^\(/, '').replace(/\)$/, '')

const evaluateExpression = expression => {
  const parsed = parseExpression(expression)
  if (parsed.length === 0) return 0
  let sum = parsed[0].startsWith('(') ? evaluateExpression(stripParams(parsed[0])) : parseInt(parsed[0], 10)
  for (let idx = 1; idx + 1 < parsed.length; idx += 2) {
    debugger
    const operator = parsed[idx]
    const operand = parsed[idx + 1].startsWith('(') ? evaluateExpression(stripParams(parsed[idx + 1])) : parseInt(parsed[idx + 1], 10)
    switch (operator) {
      case '+':
        sum += operand
        break
      case '*':
        sum *= operand
        break
    }
  }
  return sum
}

for (const testCase of testCases) {
  assert.strictEqual(evaluateExpression(testCase.expression), testCase.expected)
}

const answer = lines.map(evaluateExpression).reduce((acc, val) => acc + val, 0)
console.log({ answer })
