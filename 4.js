const input = require('fs').readFileSync('4.input', 'utf8')
const lines = input.split('\n')

const rawEntries = []
let entry = []
for (const line of lines) {
  if (line !== '') {
    entry.push(line)
  } else {
    rawEntries.push(entry)
    entry = []
  }
}

const entries = rawEntries.map(entryLines => entryLines.join(' ').split(' ').reduce((acc, s) => {
  const [f, v] = s.split(':')
  return { ...acc, [f]: v }
}, {}))

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const optionalFields = ['cid']
let numValid = 0
for (const entry of entries) {
  const hasAllRequired = requiredFields.every(f => Object.keys(entry).some(ef => ef === f))
  const hasUnknown = Object.keys(entry).some(ef => !requiredFields.includes(ef) && !optionalFields.includes(ef))
  if (hasAllRequired && !hasUnknown) numValid++
}

console.log({ numValid })
