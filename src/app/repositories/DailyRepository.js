
const Daily = require('../models/Daily')

class DailyRepository {
  async getDailiesByClass() {
    const fiis = await Daily.find({ class: 'Fundos Imobiliários' })
    const stocks = await Daily.find({ class: 'Ações' })
    const others = await Daily.find({ class: 'Não aplicável' })

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
}

module.exports = new DailyRepository()
