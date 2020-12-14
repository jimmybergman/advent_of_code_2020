const input = require('fs').readFileSync('12.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const instructions = lines.map(line => {
  const action = line.charAt(0)
  const value = parseInt(line.substring(1), 10)
  return { action, value }
})

const orderRight = ['N', 'E', 'S', 'W']
const orderLeft = orderRight.slice().reverse()

// Input contains these directions (cat 12.input  | grep L | cut -c 2- | sort | uniq -c):
//   21 180
//   6 270
//  66 90
const turn = (action, value) => {
  const steps = Math.floor(value / 90)
  const order = action === 'L' ? orderLeft : orderRight
  const newIndex = (order.indexOf(direction) + steps) % 4
  // console.log({ steps, order, newIndex })
  return order[newIndex]
}

let direction = 'E'
let northsouth = 0
let eastwest = 0

const move = (direction, units) => {
  switch (direction) {
    case 'N':
      northsouth = (northsouth + units)
      break
    case 'S':
      northsouth = (northsouth - units)
      break
    case 'E':
      eastwest = (eastwest + units)
      break
    case 'W':
      eastwest = (eastwest - units)
      break
  }
}

for (const { action, value } of instructions) {
  console.log({ before: { northsouth, eastwest, direction }, action, value })
  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      move(action, value)
      break
    case 'L':
    case 'R':
      direction = turn(action, value)
      break
    case 'F':
      move(direction, value)
      break
  }
  console.log({ after : { northsouth, eastwest, direction }, action, value })
}

const manhattan = Math.abs(northsouth) + Math.abs(eastwest)

console.log({ northsouth, eastwest, manhattan })
