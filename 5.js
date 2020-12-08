const input = require('fs').readFileSync('5.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const seat = (line) => {

  const row = parseInt(line.substr(0, 7).replace(/F/g, 0).replace(/B/g, 1), 2)
  const col = parseInt(line.substr(7).replace(/L/g, 0).replace(/R/g, 1), 2)
  const id = row * 8 + col
  return { row, col, id }
}

const seats = lines.map(line => seat(line))

const highest = seats.reduce((acc, { id }) => Math.max(id, acc), 0)
console.log(highest)
