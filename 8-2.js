const input = require('fs').readFileSync('8.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const origProgram = lines.map(line => {
  const opcode = line.split(' ')
  return { opcode: opcode[0], arg: parseInt(opcode[1], 10) }
})
console.log('orig program length ', origProgram.length)

function evaluateProgram(program) {
  const registers = {
    accumulator: 0
  }
  
  let ip = 0
  
  const visited = {}
  while (true) {
    console.log({ registers, ip })
  
    const instruction = program[ip]
    switch (instruction.opcode) {
      case 'acc':
        registers.accumulator += instruction.arg
        ip += 1
        break
      case 'jmp':
        ip += instruction.arg
        break
      case 'nop':
        ip += 1
        break
    }
  
    if (ip >= program.length) {
      return registers.accumulator
    }

    if (visited[ip]) {
      return null
    }
    visited[ip] = true
  }
}

const combinations = []
const jmpLocations = origProgram.reduce((acc, instruction, idx) => instruction.opcode === 'jmp' ? [...acc, idx] : acc, [])
const nopLocations = origProgram.reduce((acc, instruction, idx) => instruction.opcode === 'nop' ? [...acc, idx] : acc, [])
for (const jmp of jmpLocations) {
  const combo = origProgram.slice()
  combo[jmp] = { ...combo[jmp], opcode: 'nop' }
  combinations.push(combo)
}
for (const nop of nopLocations) {
  const combo = origProgram.slice()
  combo[nop] = { ...combo[nop], opcode: 'jmp' }
  combinations.push(combo)
}

let count = 0
for (const combo of combinations) {
  console.log('evaluating combo ', count, 'of length', combo.length)
  count++

  const result = evaluateProgram(combo)
  if (result !== null) {
    console.log('RESULT: ' + result)
    break
  }
}
