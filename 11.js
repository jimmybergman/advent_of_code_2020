const deepcopy = require('deepcopy')
var deepEqual = require('deep-equal')
const input = require('fs').readFileSync('11.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const originalGrid = lines.map(line => {
  return line.split('').map(c => c === 'L' ? 0 : c === '#' ? 1 : c === '.' ? null : -1)
})

const xLen = lines[0].length
const yLen = lines.length

const adjacent = (grid, x, y, num) => {
  const arr = []
  for (let i = 1; i <= num; i++) {
    // left
    if (x - i >= 0) arr.push(grid[y][x - 1])
    // right
    if (x + i < xLen) arr.push(grid[y][x + 1])
    // up
    if (y - 1 >= 0) arr.push(grid[y - 1][x])
    // down
    if (y + 1 < yLen) arr.push(grid[y + 1][x])

    // diag
    if (y - 1 >= 0 && x - 1 >= 0) arr.push(grid[y - 1][x - 1])
    if (y - 1 >= 0 && x + 1 < xLen) arr.push(grid[y - 1][x + 1])
    if (y + 1 < yLen && x + 1 < xLen) arr.push(grid[y + 1][x + 1])
    if (y + 1 < yLen && x - 1 >= 0) arr.push(grid[y + 1][x - 1])
  }

  const numOccupied = arr.filter(Boolean).reduce((acc, seat) => acc + seat, 0)
  return { numOccupied, adjacent: arr }
}

const evaluateRules = source => {
  const newGrid = deepcopy(source)
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      if (source[y][x] === 0) {
        const { numOccupied } = adjacent(source, x, y, 1)
        if (numOccupied === 0) newGrid[y][x] = 1
      }
      if (source[y][x] === 1) {
        const { numOccupied } = adjacent(source, x, y, 1)
        if (numOccupied >= 4) newGrid[y][x] = 0
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
