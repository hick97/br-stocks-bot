
const tabulation = (size) => {
  if (size === 5) {
    return '\t\t'
  }
  if (size < 5) {
    return '\t\t\t'
  }
  if (size > 5) {
    return '\t'
  }
}

const getFormattedTextByIndicators = async (fundamentals, start, end) => {
  const indicators = []
  const aux = fundamentals.slice(start, end)

  console.log(aux)

  // await aux.sort(dynamicSort('value', 'asc'))

  for (let index = 0; index < aux.length; index++) {
    const indicator = `<code>${aux[index].value}\t${tabulation((aux[index].value).length)}</code> <code>${aux[index].label}</code>\n`
    indicators.push(indicator)
  }

  return indicators.join('')
}

module.exports = { getFormattedTextByIndicators, tabulation }
