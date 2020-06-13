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

  async createStock(symbol, price, quantity, stock) {
    delete symbol['9. matchScore']

    const obj = {
      symbol: symbol['1. symbol'],
      name: symbol['2. name'],
      type: symbol['3. type'],
      region: symbol['4. region'],
      marketOpen: symbol['5. marketOpen'],
      marketClose: symbol['6. marketClose'],
      timezone: symbol['7. timezone'],
      currency: symbol['8. currency']
    }
    // Verificar se o ativo não ta no BD antes (poupar requisição)

    const { _id } = await Stock.create({ ...obj, price: parseFloat(price), quantity: parseInt(quantity), stock })
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

  async getStockQuote(symbol) {
    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${alphaFunctions.globalQuote}&symbol=${symbol}`)
    await new Promise(r => setTimeout(r, 10 * 6000))
    const options = data['Global Quote']

    const obj = {
      symbol: parseFloat(options['01. symbol']).toFixed(2),
      open: parseFloat(options['02. open']).toFixed(2),
      high: parseFloat(options['03. high']).toFixed(2),
      low: parseFloat(options['04. low']).toFixed(2),
      price: parseFloat(options['05. price']).toFixed(2),
      volume: options['06. volume'],
      latestTradingDay: options['07. latest trading day'],
      previousClose: parseFloat(options['08. previous close']).toFixed(2),
      change: options['09. change'],
      changePercent: options['10. change percent']
    }
    return obj
  }
}

module.exports = new StockRepository()
