const {
  updateWallet,
  createWallet,
  updateStockDataOnWallet
} = require('../../repositories/WalletRepository')
const { deleteStock } = require('../../repositories/StockRepository')

const Stock = require('../../models/Stock')
const Wallet = require('../../models/Wallet')

const { ErrorMessages } = require('../../enum/MessagesEnum')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { getStockValues } = require('../../helpers/StockHelper')
const { parseToCleanedFloat } = require('../../helpers/CurrencyHelper')

class WalletController {
  async execute(message) {
    try {
      const { text, chat } = message

      // get action, stock name, quantity and price
      const values = getStockValues(text)

      const hasInvalidLength = Object.keys(values).length === 0
      if (hasInvalidLength) return ErrorMessages.INVALID_COMMAND

      if (values.actions === '/del') return await deleteStock(chat.id, values.stock)

      // check if wallet and stock already exists
      const walletAlreadyExists = await Wallet.findOne({ chat_id: chat.id })
      const stockAlreadyExists = await Stock.findOne({ symbol: `${values.stock.toUpperCase()}.SAO` })

      const formattedStockObject = {
        stock: values.stock.toUpperCase(),
        quantity: parseInt(values.quantity),
        price: parseToCleanedFloat(values.price)
      }

      if (!walletAlreadyExists && !stockAlreadyExists) return await createWallet(chat, formattedStockObject, true)
      if (!walletAlreadyExists && !!stockAlreadyExists) return await createWallet(chat, formattedStockObject)
      if (!!walletAlreadyExists && !stockAlreadyExists) return await updateWallet(walletAlreadyExists, formattedStockObject, true)

      const stockIndex = await walletAlreadyExists.stocks.findIndex(s => s.stock.toUpperCase() === values.stock.toUpperCase())

      // stock exists in db, but not included on wallet
      if (stockIndex === -1) return await updateWallet(walletAlreadyExists, formattedStockObject)
      // updating existent stock on existent wallet
      return await updateStockDataOnWallet(walletAlreadyExists, stockIndex, formattedStockObject)
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new WalletController()
