const axios = require('axios')
const Stock = require('../models/Stock')

const Api = require('../services/api')
const alphaFunctions = require('../enum/alphaVantageFunctions')

class StockRepository {
  stockIsValid(message) {
    const { text } = message
    const regex = /\/stock |\/del /i
    const match = text.search(regex)

    if (match < 0) {
      return false
    }

    return true
  }

  async createStock(stock, price, quantity) {
    delete stock['9. matchScore']

    const obj = {
      symbol: stock['1. symbol'],
      name: stock['2. name'],
      type: stock['3. type'],
      region: stock['4. region'],
      marketOpen: stock['5. marketOpen'],
      marketClose: stock['6. marketClose'],
      timezone: stock['7. timezone'],
      currency: stock['8. currency']
    }
    // Verificar se o ativo não ta no BD antes (poupar requisição)

    const { _id } = await Stock.create({ ...obj, price: parseFloat(price), quantity: parseInt(quantity) })
    return _id
  }

  async updateStock(id, price, quantity) {
    const stock = await Stock.findByIdAndUpdate(id, { price: parseFloat(price), quantity: parseInt(quantity) })
    return stock
  }

  deleteStock(stock) {
    // TODO remover da wallet, mas deixa no BD

  }

  async getStockValues(text) {
    const keys = text.split(' ').map(function (item) {
      return item.trim()
    })
    const values = keys.filter(element => element !== '')

    const obj = {
      actions: values[0],
      stock: values[1],
      quantity: values[2],
      price: values[3]
    }
    return obj
  }

  async findStockData(stock) {
    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${alphaFunctions.symbolSearch}&keywords=${stock}.SAO`)
    const match = data.bestMatches[0]
    const matchScore = match ? parseFloat(match.matchScore) : 0

    if (matchScore < 0.5) return undefined
    return match
  }
}

module.exports = new StockRepository()
