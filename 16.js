const input = require('fs').readFileSync('16.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const rules = []
let ticket
const nearby = []
let section = 'rules'

for (const line of lines) {
  if (line === 'your ticket:') {
    section = 'ticket'
    continue
  }
  if (line === 'nearby tickets:') {
    section = 'nearby'
    continue
  }

  if (section === 'rules') {
    rules.push(line.split(': ')[1].split(' or ').map(range => range.split('-').map(s => parseInt(s, 10))))
  }
  if (section === 'ticket') {
    ticket = line.split(',').map(s => parseInt(s, 10))
  }
  if (section === 'nearby') {
    nearby.push(line.split(',').map(s => parseInt(s, 10)))
  }
}

const validField = num => rules.some(ranges => ranges.some(([from, to]) => num >= from && num <= to))

const invalidNearbyFields = nearby.flat().filter(f => !validField(f))
const answer = invalidNearbyFields.reduce((acc, num) => acc + num, 0)

console.log({ invalidNearbyFields, answer })
