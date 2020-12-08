const input = require('fs').readFileSync('3.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const parsedLines = lines.map(line => line.split(''))
const lineLength = parsedLines[0].length

const factors = []
const starts = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
for (let [slopeX, slopeY] of starts) {
  let numTrees = 0
  let startPosX = slopeX + 1
  let startPosY = slopeY + 1
  console.log({ startPosX, startPosY, value: parsedLines[startPosY - 1][(startPosX - 1) % lineLength] })
  while (startPosY <= parsedLines.length) {
    if (parsedLines[startPosY - 1][(startPosX - 1) % lineLength] === '#') numTrees++
    startPosX += slopeX
    startPosY += slopeY
  }
  factors.push(numTrees)
}

console.log({ factors, multiplied: factors.reduce((acc, f) => f * acc, 1) })
