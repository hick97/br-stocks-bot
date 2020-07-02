const ScrappyRepository = require('./ScrappyRepository')
const { getFormattedTextByIndicators } = require('../helpers/fundamentalsHelper')
class FundamentalsRepository {
  async isFundamentalsRequest(message) {
    const { text } = message
    const regex = /\/fundamentals/i
    const match = text.search(regex)

    if (match < 0) {
      return false
    }

    return true
  }

  async getStockFundamentals(message) {
    const { text } = message

    const keys = text.split(' ').map(function (item) {
      return item.trim()
    })
    const values = keys.filter(element => element !== '')

    const symbol = values[1]
    console.log(symbol)
    const result = await ScrappyRepository.getFundamentals(symbol)

    console.log(result)

    // console.log(getFormattedTextByIndicators(result, 0, 11))
    const valuationIndicators = await getFormattedTextByIndicators(result, 0, 12)
    const indebtednessIndicators = await getFormattedTextByIndicators(result, 12, 18)
    const efficiencyIndicators = await getFormattedTextByIndicators(result, 18, 22)
    const rentabilityIndicators = await getFormattedTextByIndicators(result, 22, 26)
    const growthIndicators = await getFormattedTextByIndicators(result, 26, 28)

    const fundamentals =
      `<b>${symbol.toUpperCase()}</b>\n\n` +
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

    console.log(fundamentals)

    return fundamentals
  }
}

module.exports = new FundamentalsRepository()
