const assert = require('assert')
const input = require('fs').readFileSync('19.input', 'utf8')
const lines = input.trim().split('\n')

const testCases = [
  { input: `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`.trim().split('\n'), expected: 2 },
]

const constructRegexp = (rule, regexpsByIndex) => {
  const regexp = rule.split(' | ').map(group => {
    const referenced = group.split(' ').map(index => regexpsByIndex[index])
    if (referenced.some(r => r === undefined)) return null
    return referenced.join('')
  })

  if (regexp.some(r => r === null)) return null
  return '(' + regexp.join('|') + ')'
}

const buildRegExps = rules => {
  const rulesByIndex = rules.map(rule => rule.split(': ')).reduce((acc, [index, rule]) => ({ ...acc, [index]: rule }), {})
  const stringMatches = Object.entries(rulesByIndex).filter(([_, rule]) => rule.startsWith('"'))
  let rulesLeft = Object.entries(rulesByIndex).filter(([_, rule]) => !rule.startsWith('"'))

  const regexpsByIndex = stringMatches.reduce((acc, [index, rule]) => ({ ...acc, [index]: rule.replace(/"/g, '') }), {})
  while (Object.keys(regexpsByIndex).length < rules.length) {
    const regexps = rulesLeft.map(([index, rule]) => [index, constructRegexp(rule, regexpsByIndex)]).filter(([_, regexp]) => regexp)
    if (regexps.length === 0) throw new Error('Unable to construct regexps')
    for (const [index, regexp] of regexps) {
      regexpsByIndex[index] = regexp
      rulesLeft = rulesLeft.filter(([i]) => i !== index)
    }
  }
  return Object.fromEntries(Object.entries(regexpsByIndex).map(([index, regexp]) => [index, new RegExp('^' + regexp + '$')]))
}

const handleInput = rulesAndMessages => {
  const rules = rulesAndMessages.slice(0, rulesAndMessages.indexOf(''))
  const messages = rulesAndMessages.slice(rulesAndMessages.indexOf('') + 1)
  const regexps = buildRegExps(rules)
  const regexp = regexps[0]
  console.log(regexp)
  const numMatches = messages.filter(message => regexp.test(message)).length
  return numMatches
}

for (const testCase of testCases) {
  assert.strictEqual(handleInput(testCase.input), testCase.expected)
}

const answer = handleInput(lines)
console.log({ answer })
