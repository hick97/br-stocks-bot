const Wallet = require('../../models/Wallet')

const { dynamicSort } = require('../../helpers/SortHelper')
const { useSentryLogger } = require('../../helpers/LogHelper')
const { sendMessageToAdmin } = require('../../helpers/AdminHelper')
const { parseToFixedFloat } = require('../../helpers/CurrencyHelper')
const { walletTabulation, walletTabulationHeader } = require('../../helpers/TabulationHelper')

const { ErrorMessages, ActionMessages } = require('../../enum/MessagesEnum')
const { emojis } = require('../../enum/EmojiEnum')

const { findStockData, createStock } = require('../StockRepository')
const { sendCustomMessage } = require('../MessageRepository')
const { getDailyBySymbol } = require('../DailyRepository')

class WalletRepository {
  async createWallet(chat, stockData, withNewStock = false) {
    if (withNewStock) {
      await sendCustomMessage({ chat_id: chat.id, text: ActionMessages.SEARCH_STOCK })

      const createdStock = await findStockData(stockData.stock)

      if (!createdStock) return ErrorMessages.NOT_FOUND

      await createStock(createdStock, stockData.stock)
    }

    await Wallet.create({
      name: chat.title,
      chat_id: chat.id,
      stocks: [stockData]
    })

    const logMessage = `Wallet was created by:\n${chat.first_name} ${chat.username ? '(@' + chat.username + ')' : ''}`
    useSentryLogger(null, logMessage)
    sendMessageToAdmin({ level: 'INFO', message: logMessage })

    return ActionMessages.STOCK_CREATED
  }

  async updateWallet(chat, walletRef, stockData, withNewStock = false) {
    if (withNewStock) {
      await sendCustomMessage({ chat_id: chat.id, text: ActionMessages.SEARCH_STOCK })

      const createdStock = await findStockData(stockData.stock)

      if (!createdStock) return ErrorMessages.NOT_FOUND

      await createStock(createdStock, stockData.stock)
    }

    await Wallet.findByIdAndUpdate(walletRef._id, {
      stocks: [...walletRef.stocks, stockData]
    })

    return ActionMessages.STOCK_CREATED
  }

  async updateStockDataOnWallet(walletRef, stockIndex, stockData) {
    walletRef.stocks[stockIndex] = stockData
    await walletRef.save()

    return ActionMessages.STOCK_UPDATED
  }

  async listWalletById(chat_id) {
    const wallet = await Wallet.findOne({
      chat_id
    })

    if (!wallet) return ErrorMessages.WALLET_IS_REQUIRED

    const { stocks: walletStocks } = wallet
    const orderedStocks = walletStocks.sort(dynamicSort({ property: 'price', order: 'desc' }))

    const stocks = orderedStocks.map((s) => {
      return (({ stock, price, quantity }) =>
        `<code>${stock.toUpperCase()}${walletTabulation(stock.length)}</code>` +
        `<code>R$${price}${walletTabulation((price.toString()).length)}</code>` +
        `<code>${quantity}</code>\n`)(s)
    })

    const walletHeaderText = [
      emojis.moneyBag +
      ' <b>SUA CARTEIRA</b> \n\n' +
      '<code>ATIVO</code>' + walletTabulationHeader.ATIVO_SPACE +
      '<code>PM</code>' + walletTabulationHeader.PM_SPACE +
      '<code>QNTD.</code> \n\n'
    ]

    const walletTextArray = walletHeaderText.concat(stocks)
    return walletTextArray.join('')
  }

  async getWalletPartials(chat_id) {
    const weights = []

    const wallet = await Wallet.findOne({
      chat_id
    })

    if (!wallet) return ErrorMessages.WALLET_IS_REQUIRED

    const { stocks, previousData } = wallet

    if (!previousData.investedAmount) return ActionMessages.NEEDS_REPORT

    for (let index = 0; index < stocks.length; index++) {
      const s = stocks[index]
      const dailyStock = await getDailyBySymbol(s.stock)
      const partialResult = s.quantity * dailyStock.price

      weights.push({
        partialResult,
        stock: s.stock,
        weight: partialResult * 100 / previousData.investedAmount
      })
    }

    const orderedWeights = weights.sort(dynamicSort({ property: 'weight', order: 'desc' }))

    const texts = orderedWeights.map(s => {
      const partialResult = s.partialResult
      const stockWeight = partialResult * 100 / previousData.investedAmount

      return `<code>${s.stock.toUpperCase()}${walletTabulation(s.stock.length)}</code>` +
        `<code>${parseToFixedFloat(stockWeight)}%\t\t</code>` +
        `<code>R$${parseToFixedFloat(partialResult)}</code>\n`
    })

    const weightHeaderText = [
      '<b>MAIS SOBRE SEUS ATIVOS</b> \n\n' +
      ' <b>TOTAL INVESTIDO: </b>\n' + `<code>R$${parseToFixedFloat(previousData.investedAmount)}</code>` + '\n\n' +
      '<code>ATIVO</code>' + walletTabulationHeader.WEIGHT_ATIVO_SPACE +
      '<code>PESO</code>' + walletTabulationHeader.ATIVO_SPACE +
      '<code>PARCIAL</code> \n\n'
    ]

    const weightTextArray = weightHeaderText.concat(texts)

    return weightTextArray.join('')
  }

  async listAllWallets() {
    const wallets = await Wallet.find({}).select('chat_id stocks previousData _id').populate('stocks')
    if (!wallets) throw Error('Ocorreu uma falha ao listar todas as carteiras cadastradas.')
    return wallets
  }
}

module.exports = new WalletRepository()
