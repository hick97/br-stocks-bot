const { getStockValues, findStockData, createStock, updateStock } = require('../repositories/StockRepository')

const staticMessages = require('../enum/messages')

const Wallet = require('../models/Wallet')
const Stock = require('../models/Stock')

class WalletRepository {
  async updateWallet(message) {
    const { text, chat } = message
    let stockData = {}
    let stockId

    // check if wallet already exists
    const walletAlreadyExists = await Wallet.findOne({ chat_id: chat.id })

    // get action, stock, quantity and price
    const values = await getStockValues(text)

    // check if stock already exists
    const stockAlreadyExists = await Stock.findOne({ symbol: `${values.stock}.SAO` })

    // when wallet does not exists
    if (!walletAlreadyExists) {
      if (!stockAlreadyExists) {
        stockData = await findStockData(values.stock)

        if (!stockData) {
          return staticMessages.NOT_FOUND
        }

        stockId = await createStock(stockData, values.price, values.quantity)
      }

      stockId = stockAlreadyExists._id

      await Wallet.create({
        name: chat.title,
        chat_id: chat.id,
        stocks: [stockId]
      })

      return staticMessages.STOCK_CREATED
    }

    // when wallet exists, but stock do not
    if (!stockAlreadyExists) {
      stockData = await findStockData(values.stock)

      if (!stockData) {
        return staticMessages.NOT_FOUND
      }

      stockId = await createStock(stockData, values.price, values.quantity)

      await Wallet.findByIdAndUpdate(walletAlreadyExists._id, {
        stocks: [...walletAlreadyExists.stocks, { _id: stockId }]
      })

      return staticMessages.STOCK_CREATED
    }

    // check if stock already exists on chat wallet
    const stockExistsOnWallet = await walletAlreadyExists.stocks.includes(String(stockAlreadyExists._id))

    // stock exists in db, but not included on wallet
    if (!stockExistsOnWallet) {
      stockId = stockAlreadyExists._id
      await updateStock(stockId, values.price, values.quantity)
      await Wallet.findByIdAndUpdate(walletAlreadyExists._id, {
        stocks: [...walletAlreadyExists.stocks, { _id: stockId }]
      })

      return staticMessages.STOCK_CREATED
    }

    // stock is included on wallet
    await updateStock(stockAlreadyExists._id, values.price, values.quantity)
    return staticMessages.STOCK_UPDATED
  }

  async listWalletStock(chat_id) {
    // TODO: listar ativo
    const stocks = await Wallet.find({
      chat_id
    })

    return stocks
  }
}

module.exports = new WalletRepository()
