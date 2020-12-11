const input = require('fs').readFileSync('9.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const numbers = lines.map(line => parseInt(line, 10))

for (let streamIndex = 25; streamIndex < numbers.length; streamIndex++) {
  const previous = numbers.slice(streamIndex - 25, streamIndex)
  const sums = previous.map(n => previous.filter(other => other !== n).map(other => other + n)).flat()
  const num = numbers[streamIndex]
  const numSums = sums.filter(sum => sum === num).length
  if (numSums === 0) {
    console.log(`${num} is not a sum of the last 25 numbers`)
    break
  }
}
