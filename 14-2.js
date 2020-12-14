require('lodash.combinations')
const _ = require('lodash')

const input = require('fs').readFileSync('14.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const applyMask = (bitmask, offset) => {
  let bitstring = offset.toString(2).padStart(36, '0').split('')
  console.log('offset', offset, bitstring.join(''))
  console.log('bitmask', bitmask)

  for (const [bit, mask] of bitmask.split('').entries()) {
    if (mask === '1') {
      // console.log(bitstring[bit], mask)
      bitstring[bit] = mask
    }
  }
  const offsets = []
  const xPositions = bitmask.split('').map((map, bit) => map === 'X' ? bit : -1).filter(bit => bit >= 0)
  console.log('xPositions', xPositions.length)

  const combos = _.combinations(xPositions.map(bit => [`${bit}/0`, `${bit}/1`]).flat(), xPositions.length).map(combo => combo.map(s => s.split('/'))).filter(combo => [...new Set(combo.map(pair => pair[0]))].length === xPositions.length)

  console.log('num combos', combos.length)
  for (const combo of combos) {
    const offset = bitstring.slice()
    for (const [bit, value] of combo) {
      offset[bit] = value
    }
    // console.log(offset)
    
    offsets.push(parseInt(offset.join(''), 2))
  }
  // console.log(offsets)

  return offsets
}

let mask
const mem = []

for (const instruction of lines) {
  const words = instruction.split(' ')
  if (words[0] === 'mask') {
    mask = words[2]
  } else {
    const offsets = applyMask(mask, parseInt(words[0].split(/[[\]]/)[1], 10))
    const value = parseInt(words[2], 10)
    for (const offset of offsets) {
      mem[offset] = value
    }
  }
}

console.log('done')
console.log('mem length', mem.length)
const sum = Object.values(mem).filter(Boolean).reduce((acc, val) => val + acc, 0)
console.log({ sum })
