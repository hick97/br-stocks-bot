const axios = require('axios')

const Wallet = require('../models/Wallet')
const Stock = require('../models/Stock')
const Quote = require('../models/Quote')

const Api = require('../services/api')
const alphaFunctions = require('../enum/alphaVantageFunctions')
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
    const stocks = await Stock.find({}).select('symbol -_id')

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
    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${alphaFunctions.symbolSearch}&keywords=${stock}.SAO`)
    const match = data.bestMatches[0]
    const matchScore = match ? parseFloat(match.matchScore) : 0

    if (matchScore < 0.5) return undefined
    return match
  }

  async createStockQuote(symbol, count) {
    const MAX_REQUESTS_PER_MINUTE = 4
    const FIRST_REQUEST = 0

    count !== FIRST_REQUEST && count % MAX_REQUESTS_PER_MINUTE === 0 && await new Promise(r => setTimeout(r, 10 * 6000))

    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${alphaFunctions.globalQuote}&symbol=${symbol}`)

    const options = data['Global Quote']

    const obj = {
      symbol: options['01. symbol'],
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

    const quoteAlreadyExists = await Quote.findOne({ symbol: obj.symbol })

    if (!quoteAlreadyExists) {
      await Quote.create(obj)
    } else {
      await Quote.findByIdAndUpdate(quoteAlreadyExists._id, obj)
    }
  }

  async getStockQuote(symbol) {
    const stockQuoteDate = await Quote.findOne({ symbol: `${symbol.toUpperCase()}.SAO` })

    return stockQuoteDate
  }
}

module.exports = new StockRepository()
