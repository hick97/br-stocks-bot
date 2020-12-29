const axios = require('axios')

const Api = require('../../services/api')

const Wallet = require('../../models/Wallet')
const Stock = require('../../models/Stock')

const { AlphaActions } = require('../../enum/AlphaVantageEnum')
const { ActionMessages, ErrorMessages } = require('../../enum/MessagesEnum')

const { stockAttributes } = require('./utils/stockAttributes')

class StockRepository {
  async listAllStocks() {
    const stocks = await Stock.find({}).select('stock -_id')

    return stocks
  }

  async createStock(share, stock) {
    delete share[stockAttributes.MATCH_SCORE]

    const obj = {
      symbol: share[stockAttributes.SYMBOL],
      name: share[stockAttributes.NAME],
      type: share[stockAttributes.TYPE],
      region: share[stockAttributes.REGION],
      marketOpen: share[stockAttributes.MARKET_OPEN],
      marketClose: share[stockAttributes.MARKET_CLOSE],
      timezone: share[stockAttributes.TIMEZONE],
      currency: share[stockAttributes.CURRENCY]
    }

    const { _id } = await Stock.create({ ...obj, stock })
    return _id
  }

  async deleteStock(chat_id, stock) {
    const wallet = await Wallet.findOne({ chat_id })
    if (!wallet) return ErrorMessages.WALLET_IS_REQUIRED

    const newStocks = wallet.stocks.filter(s => s.stock !== stock)
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

    const notFound = undefined

    if (matchScore < 0.5) return notFound
    return match
  }
}

module.exports = new StockRepository()
