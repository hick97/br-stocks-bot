
const Daily = require('../../models/Daily')
const { stockClasses } = require('../../enum/StockEnum')

class DailyRepository {
  async getDailiesByClass() {
    const dailies = await Daily.find()

    const stocks = dailies.filter(item => item.class === stockClasses.STOCK)
    const fiis = dailies.filter(item => item.class === stockClasses.FII)
    const others = dailies.filter(item => item.class === stockClasses.OTHERS)

    const result = {
      fiis,
      stocks,
      others
    }

    return result
  }

  async getDailyBySymbol(symbol) {
    const daily = await Daily.findOne({ symbol: symbol.toUpperCase() })

    return daily
  }

  async getClassBySymbol(symbol) {
    const { class: symbolClass } = await Daily.findOne({ symbol: symbol.toUpperCase() })

    return symbolClass
  }

  async getInvalidDailies() {
    const result = await Daily.find({ failed: true }).select('symbol -_id')

    return result
  }

  async updateDailyData(symbol, scrappyResult) {
    const formattedSymbol = symbol.toUpperCase()
    const quoteAlreadyExists = await Daily.findOne({ symbol: formattedSymbol })

    const obj = {
      symbol: formattedSymbol,
      price: scrappyResult.price || scrappyResult.points,
      change: scrappyResult.change,
      last: quoteAlreadyExists.price || scrappyResult.price || scrappyResult.points,
      class: scrappyResult.class,
      failed: scrappyResult.failed
    }

    if (!quoteAlreadyExists) {
      await Daily.create(obj)
    } else {
      await Daily.findByIdAndUpdate(quoteAlreadyExists._id, obj)
    }
  }
}

module.exports = new DailyRepository()
