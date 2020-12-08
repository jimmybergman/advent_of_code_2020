const input = require('fs').readFileSync('3.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const parsedLines = lines.map(line => line.split(''))
const lineLength = parsedLines[0].length
let numTrees = 0
let startPosX = 4
let startPosY = 2
while (startPosY <= parsedLines.length) {
  console.log({ startPosX, startPosY, value: parsedLines[startPosY - 1][(startPosX - 1) % lineLength] })
  if (parsedLines[startPosY - 1][(startPosX - 1) % lineLength] === '#') numTrees++
  startPosX += 3
  startPosY += 1
}

console.log(numTrees)
