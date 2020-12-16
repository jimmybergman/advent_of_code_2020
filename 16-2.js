const input = require('fs').readFileSync('16.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const rules = {}
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
    const cols = line.split(': ')
    rules[cols[0]] = cols[1].split(' or ').map(range => range.split('-').map(s => parseInt(s, 10)))
  }
  if (section === 'ticket') {
    ticket = line.split(',').map(s => parseInt(s, 10))
  }
  if (section === 'nearby') {
    nearby.push(line.split(',').map(s => parseInt(s, 10)))
  }
}

const validateRules = (num, ranges) => ranges.some(([from, to]) => num >= from && num <= to)
const validField = num => Object.values(rules).some(ranges => validateRules(num, ranges))

const invalidNearbyFields = nearby.flat().filter(f => !validField(f))
const firstAnswer = invalidNearbyFields.reduce((acc, num) => acc + num, 0)
console.log({ invalidNearbyFields, firstAnswer })

const validNearby = nearby.filter(n => n.every(f => validField(f)))
console.log({ numNearby: nearby.length, validNearby: validNearby.length })

const fieldOrderPossibilities = []
for (const [fieldName, fieldRules] of Object.entries(rules)) {
  for (let fieldIndex = 0; fieldIndex < ticket.length; fieldIndex++) {
    if (validNearby.every(t => validateRules(t[fieldIndex], fieldRules))) {
      fieldOrderPossibilities[fieldIndex] = (fieldOrderPossibilities[fieldIndex] || []).concat({ fieldIndex, fieldName })
    }
  }
}

const fieldOrder = []
while (fieldOrderPossibilities.filter(Boolean).length > 0) {
  const known = fieldOrderPossibilities.filter(p => p.length === 1).map(p => p[0])
  for (const { fieldIndex, fieldName } of known) {
    fieldOrder[fieldIndex] = fieldName
    delete fieldOrderPossibilities[fieldIndex]
    for (let idx = 0; idx < ticket.length; idx++) {
      if (fieldOrderPossibilities[idx]) {
        fieldOrderPossibilities[idx] = fieldOrderPossibilities[idx].filter(p => p.fieldName !== fieldName)
      }
    }
  }
}

console.log({ fieldOrderPossibilities, fieldOrder })

const parsedTicket = ticket.reduce((acc, v, idx) => ({ ...acc, [fieldOrder[idx]]: v }), {})
const answer = Object.entries(parsedTicket).filter(([field]) => field.startsWith('departure')).reduce((acc, [_, v]) => acc * v, 1)
console.log({ fieldOrder, ticket, parsedTicket, answer })
