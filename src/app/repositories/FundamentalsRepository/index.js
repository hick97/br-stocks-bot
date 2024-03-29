const ScrappyRepository = require('../ScrappyRepository')
const Fundamentals = require('../../models/Fundamentals')

const { useSentryLogger } = require('../../helpers/LogHelper')

class FundamentalsRepository {
  async updateAllFundamentals() {
    const stocksToUpdate = await Fundamentals.find()

    for (let index = 0; index < stocksToUpdate.length; index++) {
      const { symbol, _id: stockId } = stocksToUpdate[index]
      const indicators = await ScrappyRepository.scrappyFundamentalsData(symbol)
      const isValid = !!indicators && indicators.length !== 0

      isValid
        ? await Fundamentals.findByIdAndUpdate(stockId, { indicators })
        : useSentryLogger(`Falha ao pegar fundamentos para o symbol=${symbol}`)
    }
  }

  async getFundamentalsByStock(formattedSymbol) {
    try {
      const fundamentals = await Fundamentals.findOne({ symbol: formattedSymbol })
      const fundamentalsNotFound = !fundamentals

      if (fundamentalsNotFound) {
        const indicators = await ScrappyRepository.scrappyFundamentalsData(formattedSymbol)
        const isValid = !!indicators && indicators.length !== 0
        if (isValid) {
          const newFundamentals = await Fundamentals.create({
            symbol: formattedSymbol,
            indicators
          })
          return newFundamentals.indicators
        }
      }
      return fundamentals.indicators
    } catch (error) {
      useSentryLogger(error, `Falha ao pegar fundamentos para o symbol=${formattedSymbol}`)
    }
  }
}

module.exports = new FundamentalsRepository()
