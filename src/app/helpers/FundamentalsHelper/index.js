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

const getFundamentalsText = async (result, symbol) => {
  const valuationIndicators = await formatTextByIndicatorsType(result, 'valuation')
  const indebtednessIndicators = await formatTextByIndicatorsType(result, 'indebtedness')
  const efficiencyIndicators = await formatTextByIndicatorsType(result, 'efficiency')
  const rentabilityIndicators = await formatTextByIndicatorsType(result, 'rentability')
  const growthIndicators = await formatTextByIndicatorsType(result, 'growth')

  const formattedSymbol = symbol.toUpperCase()

  const fundamentals =
    `<b>${formattedSymbol}</b>\n\n` +
    '<b>VALUATION</b>\n' +
    valuationIndicators + '\n' +
    '<b>ENDIVIDAMENTO</b>\n' +
    indebtednessIndicators + '\n' +
    '<b>EFICIÊNCIA</b>\n' +
    efficiencyIndicators + '\n' +
    '<b>RENTABILIDADE</b>\n' +
    rentabilityIndicators + '\n' +
    '<b>CRESCIMENTO</b>\n' +
    growthIndicators + '\n'

  return fundamentals
}

module.exports = { formatTextByIndicatorsType, fundamentalsCommandIsValid, getFundamentalsText }
