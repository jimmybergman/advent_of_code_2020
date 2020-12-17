const deepcopy = require('deepcopy')
const input = require('fs').readFileSync('17-small.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const originalGrid = [lines.map(line => {
  return line.split('').map(c => c === '.' ? 0 : 1)
})]

const neighborIndexes = (x, y, z) => [x - 1, x, x + 1].map(x => [y - 1, y, y + 1].map(y => [z - 1, z, z + 1].map(z => [x, y , z]))).flat(2).filter(([nx, ny, nz]) => !(nx === x && ny === y && nz === z))

const allIndexes = grid => Object.keys(grid).sort().map(z => Object.keys(grid[z]).sort().map(y => Object.keys(grid[z][y]).sort().map(x => ([x, y, z])))).flat(2)
/*
const allIndexes = grid => {
  const zIndexes = Object.keys(grid[z]).map(k => parseInt(k, 10))
  
  const minX = Object.keys(grid[z]).map(k => parseInt(k, 10)).re
  Object.keys(grid).sort().map(z => Object.keys(grid[z]).sort().map(y => Object.keys(grid[z][y]).sort().map(x => ([x, y, z])))).flat(2)
}
*/

const gridValue = (grid, x, y, z) => grid[z] && grid[z][y] && grid[z][y][x] ? 1 : 0

let cycle = 0

const countActive = grid => allIndexes(grid).filter(([x, y, z]) => gridValue(grid, x, y, z)).length

// Still buggy
const printGrid = grid => {
  if (cycle) console.log('\n')
  console.log(`Cycle ${cycle}, num active: ${countActive(grid)}`)

  for (const z of Object.keys(grid).sort()) {
    console.log(`z=${z}`)
    const yIndexes = Object.keys(grid[z]).map(y => parseInt(y, 10)).sort()
    if (yIndexes.length === 0) continue
    const minX = yIndexes.reduce((acc, y) => (grid[z][y] || []).map(x => parseInt(x, 10)).reduce((accX, x) => Math.min(x, accX), Infinity), Infinity)
    const maxX = yIndexes.reduce((acc, y) => (grid[z][y] || []).map(x => parseInt(x, 10)).reduce((accX, x) => Math.max(x, accX), -Infinity), -Infinity)
    for (let y = yIndexes[0]; y <= yIndexes[yIndexes.length - 1]; y++) {
      const line = []
      for (let x = minX; x <= maxX; x++) {
        line.push(gridValue(grid, x, y, z) ? '#' : '.')
      }
      console.log(line.join(''))
    } 
  }
}

let currentGrid = deepcopy(originalGrid)
while (cycle <= 6) {
  printGrid(currentGrid)
  if (cycle === 6) {
    break
  }

  const mutatedGrid = deepcopy(currentGrid)
  const allSetIndexes = allIndexes(currentGrid)
  const cubeIndexes = [...allSetIndexes, ...allSetIndexes.map(([x, y, z]) => neighborIndexes(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10))).flat()]
  for (const [x, y, z] of cubeIndexes) {
    const cubeNeighbors = neighborIndexes(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10))
    const activeNeighbors = cubeNeighbors.filter(([x, y, z]) => gridValue(currentGrid, x, y, z)).length
    const cubeValue = gridValue(currentGrid, x, y, z)
    if (cubeValue) {
      if (![2, 3].includes(activeNeighbors)) {
        if (!mutatedGrid[z]) mutatedGrid[z] = []
        if (!mutatedGrid[z][y]) mutatedGrid[z][y] = []
        mutatedGrid[z][y][x] = 0
      }
    } else {
      if (activeNeighbors === 3) {
        if (!mutatedGrid[z]) mutatedGrid[z] = []
        if (!mutatedGrid[z][y]) mutatedGrid[z][y] = []
        mutatedGrid[z][y][x] = 1
      }
    }
  }
  cycle++
  currentGrid = mutatedGrid
}
