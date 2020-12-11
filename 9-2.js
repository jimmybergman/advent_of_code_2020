const input = require('fs').readFileSync('9.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const numbers = lines.map(line => parseInt(line, 10))

let firstInvalid
for (let streamIndex = 25; streamIndex < numbers.length; streamIndex++) {
  const previous = numbers.slice(streamIndex - 25, streamIndex)
  const sums = previous.map(n => previous.filter(other => other !== n).map(other => other + n)).flat()
  const num = numbers[streamIndex]
  const numSums = sums.filter(sum => sum === num).length
  if (numSums === 0) {
    firstInvalid = num
    break
  }
}

for (let inner = 0; inner < numbers.length; inner++) {
  let sum = 0
  for (let outer = inner; outer < numbers.length; outer++) {
    const terms = numbers.slice(inner, outer + 1)
    const sum = terms.reduce((acc, term) => acc + term, 0)
    // console.log({ sum, inner, outer, firstInvalid })
    if (sum === firstInvalid) {
      const min = terms.reduce((acc, term) => Math.min(acc, term), terms[0])
      const max = terms.reduce((acc, term) => Math.max(acc, term), 0)
      console.log({ min, max, sum: max + min })
      process.exit(0)
    } else if (sum > firstInvalid) {
      continue
    }
  }
}
