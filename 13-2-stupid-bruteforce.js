const input = require('fs').readFileSync('13.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const busses = lines[1].split(',').map(bus => bus === 'x' ? null : parseInt(bus, 10))
const firstBus = busses.findIndex(Boolean)
const constraints = busses.map((bus, minutes) => ({ bus, minutesAfter: minutes - firstBus }))
console.log(constraints.filter(c => c.bus))

const leastFrequentBus = busses.slice().filter(Boolean).reduce((acc, bus) => Math.max(bus, acc), 0)
const mostFrequentBus = busses.slice().filter(Boolean).reduce((acc, bus) => Math.min(bus, acc), Infinity)
const window = constraints.reduce((acc, c) => Math.max(acc, c.minutesAfter), 0)

const departuresAtOrAfter= (num, min, numDepartures = 10) => {
  const start = Math.floor(min / num) *  num
  const departures = []
  for (let idx = 0; idx < numDepartures; idx++) {
    departures.push(start + (idx * num))
  }

  return departures.filter(d => d >= min).map(departure => ({ bus: num, departure }))
}

const checkConstraints = departures => {
  for (const firstBusDeparture of departures.filter(d => d.bus === busses[firstBus])) {
    let ok = true
    for (const { bus, minutesAfter } of constraints) {
      if (bus && !departures.some(d => d.bus === bus && d.departure === firstBusDeparture.departure + minutesAfter)) {
        ok = false
        break
      }
    }

    if (ok) {
      console.log('constraints matched at', firstBusDeparture)
      for (const { bus, minutesAfter } of constraints) {
        if (!bus) continue
        const departure = departures.find(d => d.bus === bus && d.departure === firstBusDeparture.departure + minutesAfter)
        console.log(departure)
      }
      process.exit(0)
    }
  }
}

let start = 0
const numBatch = 100000
while (true) {
  const departuresLeastFrequent = departuresAtOrAfter(leastFrequentBus, start, numBatch)
  console.log(`calculated ${numBatch} departures for ${leastFrequentBus} starting from ${start}`)
  for (const departure of departuresLeastFrequent) {
    const departuresRest = busses.filter(bus => bus !== leastFrequentBus).map(bus => departuresAtOrAfter(bus, departure.departure - window, (leastFrequentBus/mostFrequentBus) + 1)).flat()
    checkConstraints([departure, ...departuresRest])
    start = departure.departure + 1
  }
}
