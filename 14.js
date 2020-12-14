const input = require('fs').readFileSync('14.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const applyMask = (bitmask, num) => {
  let bitstring = num.toString(2).padStart(36, '0').split('')
  for (const [bit, mask] of bitmask.split('').entries()) {
    if (mask !== 'X') {
      bitstring[bit] = mask
    }
  }
  return parseInt(bitstring.join(''), 2)
}

let mask
const mem = []

for (const instruction of lines) {
  const words = instruction.split(' ')
  if (words[0] === 'mask') {
    mask = words[2]
  } else {
    const offset = words[0].split(/[[\]]/)[1]
    mem[offset] = applyMask(mask, parseInt(words[2]))
  }
}

const sum = mem.filter(Boolean).reduce((acc, val) => val + acc, 0)
console.log({ mem, sum })
