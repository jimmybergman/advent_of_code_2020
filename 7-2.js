const input = require('fs').readFileSync('7.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const rules = lines.map(line => {
// dotted blue bags contain 5 wavy green bags, 3 pale beige bags.
  const match = line.match(/^(?<attr>\w+)\s+(?<color>\w+)\s+bags?\s+contains?\s+(?<contains>no other bags|(,?\s*(?<containNum>\d+)\s+(?<containAttr>\w+)\s+(?<containCol>\w+)\s+bags?)*)\.$/)
// 5 wavy green bags, 3 pale beige bags
  const containsMatches = match && match.groups.contains && match.groups.contains.matchAll(/,?\s*(?<containNum>\d+)\s+(?<containAttr>\w+)\s+(?<containCol>\w+)\s+/g)
  if (match) {
    if (containsMatches) {
      const allContains = [...containsMatches].map(c => ({ ...c.groups, id: `${c.groups.containAttr}-${c.groups.containCol}` }))
      return { ...match.groups, contains: allContains, id: `${match.groups.attr}-${match.groups.color}` }
    } else {
      throw new Error(`Contains Regex doesn't match ${line}`)
    }
  } else {
    throw new Error(`Regex doesn't match ${line}`)
  }
}).reduce((acc, rule) => ({ ...acc, [rule.id]: rule}), {})

const numContainedBags = (containerId) => rules[containerId].contains.reduce((acc, { containNum, id }) => parseInt(containNum, 10) + parseInt(containNum, 10) * numContainedBags(id) + acc, 0)

console.log(rules['shiny-gold'].contains)
const numBagsInGolden = numContainedBags('shiny-gold')
console.log(numBagsInGolden)
