const assert = require('assert')
const input = require('fs').readFileSync('19-2.input', 'utf8')
const lines = input.trim().split('\n')

const constructRegexp = (rule, regexpsByIndex) => {
  if (regexpsByIndex['42'] && rule === '42 | 42 8') {
    return regexpsByIndex['42'] + '+'
  } else if (regexpsByIndex['42'] && regexpsByIndex['31'] && rule === '42 31 | 42 11 31') {
    // 4231
    // 42423131
    // 424242313131
    // 4242424231313131
    const combos = []
    for (let idx = 1; idx < 100; idx++) {
      combos.push(`${regexpsByIndex['42']}{${idx}}${regexpsByIndex['31']}{${idx}}`)
    }
    return '(' + combos.join('|') + ')'
  }

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

const answer = handleInput(lines)
console.log({ answer })
