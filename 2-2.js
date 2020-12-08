const input = require('fs').readFileSync('2.input', 'utf8')
const lines = input.split('\n').filter(Boolean)

const parsedLines = lines.map(line => {
  const match = line.match(/^(?<min>\d+)-(?<max>\d+)\s+(?<letter>[a-z]):\s+(?<password>.*)$/)
  if (!match) throw new Error(`No match for ${line}`)
  return match.groups
})

const validPasswords = parsedLines.filter(({ min, max, letter, password }) => {
  return (password.charAt(min - 1) === letter) ^ (password.charAt(max - 1) === letter)
})

console.log(`Number of password: ${parsedLines.length}, Number of valid: ${validPasswords.length}`)
