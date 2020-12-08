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

const groups = rawEntries.map(entryLines => {
  const persons = entryLines.map(line => {
    const answers = line.split('').reduce((acc, question) => ({ ...acc, [question]: true }), {})
    return answers
  })
  const questions = Object.keys(persons[0])
  return questions.reduce((acc, question) => (persons.every(person => person[question]) ? 1 : 0) + acc, 0)
})

const sumOfSums = groups.reduce((acc, sum) => acc + sum, 0)
console.log(sumOfSums)
