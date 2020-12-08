const input = require('fs').readFileSync('6.input', 'utf8')
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

const groups = rawEntries.map(entryLines => entryLines.join('').split('').reduce((acc, question) => {
  return { ...acc, [question]: (acc[question] || 0) + 1 }
}, {}))

const countSum = groups.reduce((acc, g) => Object.keys(g).length + acc, 0)
console.log(countSum)
