const deepcopy = require('deepcopy')
var deepEqual = require('deep-equal')
const input = require('fs').readFileSync('11.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const originalGrid = lines.map(line => {
  return line.split('').map(c => c === 'L' ? 0 : c === '#' ? 1 : c === '.' ? null : -1)
})

const xLen = lines[0].length
const yLen = lines.length

const firstVisible = (grid, x, y, dirX, dirY) => {
  let offsetX = dirX
  let offsetY = dirY
  while (x + offsetX >= 0 && x + offsetX < xLen && y + offsetY >= 0 && y + offsetY < yLen) {
    if (grid[y + offsetY][x + offsetX] !== null) {
      return grid[y + offsetY][x + offsetX]
    }
    offsetX += dirX
    offsetY += dirY
  }
  return null
}

const adjacent = (grid, x, y) => {
  const arr = [
    firstVisible(grid, x, y, 0, -1),
    firstVisible(grid, x, y, 0, 1),
    firstVisible(grid, x, y, -1, 0),
    firstVisible(grid, x, y, -1, 1),
    firstVisible(grid, x, y, -1, -1),
    firstVisible(grid, x, y, 1, -1),
    firstVisible(grid, x, y, 1, 0),
    firstVisible(grid, x, y, 1, 1),
  ].filter(Boolean)

  const numOccupied = arr.filter(Boolean).reduce((acc, seat) => acc + seat, 0)
  return { numOccupied, adjacent: arr }
}

const evaluateRules = source => {
  const newGrid = deepcopy(source)
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      if (source[y][x] === 0) {
        const { numOccupied } = adjacent(source, x, y)
        if (numOccupied === 0) newGrid[y][x] = 1
      }
      if (source[y][x] === 1) {
        const { numOccupied } = adjacent(source, x, y)
        if (numOccupied >= 5) newGrid[y][x] = 0
      }
    }
  }

  return newGrid
}

const numOccupied = grid => grid.reduce((gridAcc, line) => gridAcc + line.filter(Boolean).reduce((acc, seat) => acc + seat, 0), 0)


const grids = [deepcopy(originalGrid)]
let iteration = 0
const printGrid = () => console.log(`Grid ${iteration}:\n` + grids[iteration].map(cols => cols.map(col => col === 0 ? 'L' : col === 1 ? '#' : '.').join('')).join('\n') + '\n')

printGrid()
do {
  iteration++
  grids[iteration] = evaluateRules(grids[iteration - 1])
  printGrid()
} while(!deepEqual(grids[iteration], grids[iteration - 1], { strict: true }))

console.log({ iteration, numOccupied: numOccupied(grids[iteration]) })
