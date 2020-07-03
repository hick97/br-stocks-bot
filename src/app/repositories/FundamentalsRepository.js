const ScrappyRepository = require('./ScrappyRepository')
const Fundamentals = require('../models/Fundamentals')

const { getFormattedTextByIndicators } = require('../helpers/fundamentalsHelper')
const { useSentryLogger } = require('../helpers/exceptionHelper')

class FundamentalsRepository {
  // TODO - Maybe schedule once a month
  async updateAllFundamentals() { }

  async getFundamentalsByStock(symbol) {
    try {
      let stock = await Fundamentals.findOne({ symbol: symbol.toUpperCase() })

      if (!stock) {
        console.log('CRIANDO FUNDAMENTOS NO DB PARA O ATIVO: ' + symbol)
        const result = await ScrappyRepository.getFundamentals(symbol)
        stock = await Fundamentals.create({
          symbol: symbol.toUpperCase(),
          indicators: result
        })
      }
      // console.log('RETORNANDO FUNDAMENTOS DO ATIVO: ' + symbol)
      return stock.indicators
    } catch (error) {
      useSentryLogger(error, `Falha ao pegar fundamentos para o  symbol=${symbol}`)
    }
  }

  async isFundamentalsRequest(message) {
    const { text } = message
    const regex = /\/fundamentals/i
    const match = text.search(regex)

    if (match < 0) {
      return false
    }
    console.log('entrei nos fundamentos')

    return true
  }

  async getFundamentalsText(result, symbol) {
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

    // console.log(fundamentals)

    return fundamentals
  }
  /*
    async createStockFundamentals(symbol) {
      // console.log(symbol)
      const result = await ScrappyRepository.getFundamentals(symbol)

      console.log(result)
    }
    */
}

module.exports = new FundamentalsRepository()
