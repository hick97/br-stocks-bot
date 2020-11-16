
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

  async getClassBySymbol(symbol) {
    const { class: symbolClass } = await Daily.findOne({ symbol: symbol.toUpperCase() })

    return symbolClass
  }

  async getInvalidDailies() {
    const result = await Daily.find({ failed: true }).select('symbol -_id')

    return result
  }
}

module.exports = new DailyRepository()
