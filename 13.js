const input = require('fs').readFileSync('13.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const earliestTime = parseInt(lines[0], 10)
const busses = lines[1].split(',').filter(bus => bus !== 'x').map(bus => parseInt(bus, 10))

const departuresAtOrAfter= (num, min, numDepartures = 10) => {
  const start = Math.floor(min / num) *  num
  const departures = []
  for (let idx = 0; idx < numDepartures; idx++) {
    departures.push(start + (idx * num))
  }

  return departures.filter(d => d >= min)
}

const departures = busses.map((bus) => departuresAtOrAfter(bus, earliestTime).map(departure => ({ departure, bus }))).flat()
departures.sort((a, b) => a.departure - b.departure)

const first = departures[0]
const answer = (first.departure - earliestTime) * first.bus

console.log({ earliestTime, busses, departures, answer })
