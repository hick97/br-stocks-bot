const axios = require('axios')

const Api = require('../../services/api')

const Wallet = require('../../models/Wallet')
const Stock = require('../../models/Stock')

const { scrappyLastStockDataUpdate } = require('../../repositories/ScrappyRepository')

const { AlphaActions } = require('../../enum/AlphaVantageEnum')
const { ActionMessages, ErrorMessages } = require('../../enum/MessagesEnum')

const { stockAttributes, defaultAttributes } = require('./utils/stockAttributes')

class StockRepository {
  async listAllStocks() {
    const stocks = await Stock.find({}).select('stock -_id')

    return stocks
  }

  async createStock(share, stock) {
    const isAlphaVantageData = !!share[stockAttributes.MATCH_SCORE]

    isAlphaVantageData && delete share[stockAttributes.MATCH_SCORE]

    const obj = {
      symbol: share[stockAttributes.SYMBOL] || `${stock.toUpperCase()}.SAO`,
      name: share[stockAttributes.NAME] || defaultAttributes.NAME,
      type: share[stockAttributes.TYPE] || defaultAttributes.TYPE,
      region: share[stockAttributes.REGION] || defaultAttributes.REGION,
      marketOpen: share[stockAttributes.MARKET_OPEN] || defaultAttributes.MARKET_OPEN,
      marketClose: share[stockAttributes.MARKET_CLOSE] || defaultAttributes.MARKET_CLOSE,
      timezone: share[stockAttributes.TIMEZONE] || defaultAttributes.TIMEZONE,
      currency: share[stockAttributes.CURRENCY] || defaultAttributes.CURRENCY
    }

    const { _id } = await Stock.create({ ...obj, stock })
    return _id
  }

  async deleteStock(chat_id, stock) {
    const wallet = await Wallet.findOne({ chat_id })
    if (!wallet) return ErrorMessages.WALLET_IS_REQUIRED

    const newStocks = wallet.stocks.filter(s => s.stock.toUpperCase() !== stock.toUpperCase())
    const hasNoChanges = wallet.stocks.length === newStocks.length
    if (hasNoChanges) return ErrorMessages.NOT_FOUND

    wallet.stocks = newStocks
    await wallet.save()

    return ActionMessages.WALLET_UPDATED
  }

  async findStockData(stock) {
    const { data } = await axios.get(`${Api.alphaVantageURL}&function=${AlphaActions.symbolSearch}&keywords=${stock}.SAO`)
    const [match] = data.bestMatches
    const matchScore = match ? parseFloat(match.matchScore) : 0

    const notFound = matchScore < 0.5

    if (notFound) {
      const stockToMatch = stock.toUpperCase()
      const { stock: scrappedName } = await scrappyLastStockDataUpdate(stockToMatch)

      const existsOnB3 = scrappedName === stockToMatch

      if (!existsOnB3) return undefined

      return true
    }

    return match
  }
}

module.exports = new StockRepository()
