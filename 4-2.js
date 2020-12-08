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

const rules = {
  byr: [s => s.match(/^\d{4}$/), s => parseInt(s, 10) >= 1910 && parseInt(s, 10) <= 2002],
  iyr: [s => s.match(/^\d{4}$/), s => parseInt(s, 10) >= 2010 && parseInt(s, 10) <= 2020],
  eyr: [s => s.match(/^\d{4}$/), s => parseInt(s, 10) >= 2020 && parseInt(s, 10) <= 2030],
  hgt: [s => s.match(/^\d+(cm|in)$/), s => {
    const match = s.match(/^(?<num>\d+)(?<unit>cm|in)$/)
    if (match) {
      const num = parseInt(match.groups.num, 10)
      if (match.groups.unit === 'cm') {
        return num >= 150 && num <= 193
      } else {
        return num >= 59 && num <= 76
      }
    }
    return false
  }],
  hcl: [s => s.match(/^#[0-9a-f]{6}$/)],
  ecl: [s => s.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/)],
  pid: [s => s.match(/^\d{9}$/)],
}

let numValid = 0
for (const entry of entries) {
  const hasAllRequired = requiredFields.every(f => Object.keys(entry).some(ef => ef === f))
  const hasUnknown = Object.keys(entry).some(ef => !requiredFields.includes(ef) && !optionalFields.includes(ef))
  if (hasAllRequired && !hasUnknown) {
    if (requiredFields.every(field => rules[field].every(validator => validator(entry[field])))) {
      numValid++
    }
  }
}

console.log({ numValid })
