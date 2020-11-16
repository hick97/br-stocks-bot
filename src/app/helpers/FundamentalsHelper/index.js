const { fundamentalsTabulation } = require('../TabulationHelper')

const { rangeByIndicatorsType } = require('./utils/indicatorsUtils')

const fundamentalsCommandIsValid = (term) => {
  const regex = /\/fundamentals/i
  const match = term.search(regex)

  const matched = match !== -1

  return matched
}

const formatTextByIndicatorsType = async (fundamentals, type) => {
  const [start, end] = rangeByIndicatorsType[type]
  const indicators = fundamentals.slice(start, end)

  const indicatorsText = indicators.map((indicator) => {
    const { value, label } = indicator
    const tabulation = fundamentalsTabulation(value.length)
    const text = `<code>${value}\t${tabulation}</code> <code>${label}</code>\n`

    return text
  })

  return indicatorsText.join('')
}

module.exports = { formatTextByIndicatorsType, fundamentalsCommandIsValid }
