const input = require('fs').readFileSync('10.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const adapters = lines.map(line => parseInt(line, 10))
adapters.sort((a, b) => a - b)

const numPaths = adapters.reduce((acc, adapter) => {
  acc[adapter] = (acc[adapter - 3] || 0) + (acc[adapter - 2] || 0) + (acc[adapter - 1] || 0)
  return acc
}, [1])

console.log(numPaths)
console.log(numPaths[numPaths.length - 1])
