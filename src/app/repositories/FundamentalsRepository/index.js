const ScrappyRepository = require('../ScrappyRepository')
const Fundamentals = require('../../models/Fundamentals')

const { useSentryLogger } = require('../../helpers/LogHelper')

class FundamentalsRepository {
  async updateAllFundamentals() {
    const stocksToUpdate = await Fundamentals.find()

    for (let index = 0; index < stocksToUpdate.length; index++) {
      const { symbol, _id: stockId } = stocksToUpdate[index]
      const indicators = await ScrappyRepository.getFundamentals(symbol)
      const isValid = indicators.length !== 0

      isValid
        ? await Fundamentals.findByIdAndUpdate(stockId, { indicators })
        : useSentryLogger(`Falha ao pegar fundamentos para o symbol=${symbol}`)
    }
  }

  async getFundamentalsByStock(symbol) {
    try {
      const formattedSymbol = symbol.toUpperCase()
      const fundamentals = await Fundamentals.findOne({ symbol: formattedSymbol })
      const fundamentalsNotFound = !fundamentals

      if (fundamentalsNotFound) {
        const result = await ScrappyRepository.getFundamentals(symbol)
        const isValid = result.length !== 0

        if (isValid) {
          const newFundamentals = await Fundamentals.create({
            symbol: formattedSymbol,
            indicators: result
          })
          return newFundamentals.indicators
        }
      }
      return fundamentals.indicators
    } catch (error) {
      useSentryLogger(error, `Falha ao pegar fundamentos para o symbol=${symbol}`)
    }
  }
}

module.exports = new FundamentalsRepository()
