const input = require('fs').readFileSync('8.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const program = lines.map(line => {
  const opcode = line.split(' ')
  return { opcode: opcode[0], arg: parseInt(opcode[1], 10) }
})

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

  if (visited[ip]) {
    console.log({ registers, ip })
    process.exit(0)
  }

  visited[ip] = true
}
