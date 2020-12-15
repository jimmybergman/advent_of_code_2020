const input = require('fs').readFileSync('15.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const small = '0,3,6'
const test = false
const starting = test ? small.split(',') : lines[0].split(',').map(l => parseInt(l, 10))

let turn = 1
const spoken = []
let lastSpoken = null
const end = 10000000

while (true) {
  if (turn <= starting.length) {
    lastSpoken = starting[turn - 1]
    spoken[lastSpoken] = [null, turn]
  } else {
    if (spoken[lastSpoken][0] === null) {
      lastSpoken = 0
    } else {
      lastSpoken = spoken[lastSpoken][1] - spoken[lastSpoken][0] 
    }

    if (spoken[lastSpoken]) {
      spoken[lastSpoken][0] = spoken[lastSpoken][1]
      spoken[lastSpoken][1] = turn
    } else {
      spoken[lastSpoken] = [null, turn]
    }
  }

  if (end < 10000 || turn % 10000 === 0 || turn === end) {
    console.log(`Turn ${turn}: ${lastSpoken}`)
  }
  if (turn === end) {
    break
  }
  turn++
}
