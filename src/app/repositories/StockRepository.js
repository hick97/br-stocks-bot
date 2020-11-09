const axios = require('axios')

const Wallet = require('../models/Wallet')
const Stock = require('../models/Stock')

const Api = require('../services/api')
const { AlphaActions } = require('../enum/AlphaVantageEnum')
const staticMessages = require('../enum/messages')

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

  async listAllStocks() {
    const stocks = await Stock.find({}).select('stock -_id')

    return stocks
  }

  async createStock(symbol, stock) {
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

    const { _id } = await Stock.create({ ...obj, stock })
    return _id
  }

  async deleteStock(chat_id, stock) {
    const wallet = await Wallet.findOne({ chat_id })
    const { stocks } = wallet

    const newStocks = stocks.filter(s => s.stock !== stock)

    wallet.stocks = newStocks
    await wallet.save()

    return staticMessages.WALLET_UPDATED
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
    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${AlphaActions.symbolSearch}&keywords=${stock}.SAO`)
    const match = data.bestMatches[0]
    const matchScore = match ? parseFloat(match.matchScore) : 0

    if (matchScore < 0.5) return undefined
    return match
  }
}

module.exports = new StockRepository()
