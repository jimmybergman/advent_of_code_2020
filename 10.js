const input = require('fs').readFileSync('10.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const adapters = lines.map(line => parseInt(line, 10))
adapters.sort((a, b) => a - b)
const device = adapters[adapters.length - 1] + 3

let currentJoltage = 0
const differencesByDiff = {}
for (const adapter of adapters) {
  if (adapter - currentJoltage > 3) {
    console.log(adapter, currentJoltage)
    throw new Error('No chain with all adapters found')
  }

  const difference = adapter - currentJoltage
  differencesByDiff[difference] = (differencesByDiff[difference] || 0) + 1
  currentJoltage = adapter
}

const answer = differencesByDiff[1] * (differencesByDiff[3] + 1)
console.log({ currentJoltage, differencesByDiff, answer })
