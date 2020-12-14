const input = require('fs').readFileSync('12.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const instructions = lines.map(line => {
  const action = line.charAt(0)
  const value = parseInt(line.substring(1), 10)
  return { action, value }
})

let northsouth = 0
let eastwest = 0
let waypointNorthsouth = 1
let waypointEastwest = 10

const moveWaypoint = (direction, units) => {
  switch (direction) {
    case 'N':
      waypointNorthsouth = (waypointNorthsouth + units)
      break
    case 'S':
      waypointNorthsouth = (waypointNorthsouth - units)
      break
    case 'E':
      waypointEastwest = (waypointEastwest + units)
      break
    case 'W':
      waypointEastwest = (waypointEastwest - units)
      break
  }
}

for (const { action, value } of instructions) {
  console.log({ before: { action, value, waypointNorthsouth, waypointEastwest, northsouth, eastwest } })
  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      moveWaypoint(action, value)
      break
    case 'R':
      for (let numRotation = 0; numRotation < value / 90; numRotation++) {
        const newNorthsouth = waypointEastwest * -1
        const newEastwest = waypointNorthsouth
        waypointNorthsouth = newNorthsouth
        waypointEastwest = newEastwest
      }
      break
    case 'L':
      for (let numRotation = 0; numRotation < value / 90; numRotation++) {
        console.log(`L${numRotation+1}`)
        const newNorthsouth = waypointEastwest
        const newEastwest = waypointNorthsouth * -1
        waypointNorthsouth = newNorthsouth
        waypointEastwest = newEastwest
      }
      break
    case 'F':
      northsouth += waypointNorthsouth * value
      eastwest += waypointEastwest * value
      break
  }
  console.log({ after : { action, value, waypointNorthsouth, waypointEastwest, northsouth, eastwest } })
}

const manhattan = Math.abs(northsouth) + Math.abs(eastwest)

console.log({ northsouth, eastwest, manhattan })
