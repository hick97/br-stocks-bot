const { getStockValues, findStockData, createStock, deleteStock } = require('../repositories/StockRepository')
const { dynamicSort } = require('../helpers/sortHelper')
const { walletTabulation } = require('../helpers/walletHelper')

const { useSentryLogger } = require('../helpers/exceptionHelper')
const { sendMessageToAdmin } = require('../helpers/adminHelper')

const staticMessages = require('../enum/messages')

const Wallet = require('../models/Wallet')
const Stock = require('../models/Stock')

class WalletRepository {
  async updateWallet(message) {
    const { text, chat } = message
    let stockData = {}
    // let stockId

    // check if wallet already exists
    const walletAlreadyExists = await Wallet.findOne({ chat_id: chat.id })

    // get action, stock, quantity and price
    const values = await getStockValues(text)

    if (values.actions === '/del') {
      return await deleteStock(chat.id, values.stock)
    }
    const formattedPrice = values.price.replace(/,/g, '.')

    // check if stock already exists
    const stockAlreadyExists = await Stock.findOne({ symbol: `${(values.stock).toUpperCase()}.SAO` })

    // when wallet does not exists
    if (!walletAlreadyExists) {
      if (!stockAlreadyExists) {
        stockData = await findStockData(values.stock)

        if (!stockData) {
          return staticMessages.NOT_FOUND
        }

        await createStock(stockData, values.stock)
      }

      await Wallet.create({
        name: chat.title,
        chat_id: chat.id,
        stocks: [{
          stock: values.stock,
          quantity: parseInt(values.quantity),
          price: parseFloat(formattedPrice)
        }]
      })

      useSentryLogger(null, `Carteira criada por ${chat.first_name}(${chat.username})`)
      sendMessageToAdmin('INFO', `Carteira criada por ${chat.first_name}(${chat.username})`)

      return staticMessages.STOCK_CREATED
    }

    // when wallet exists, but stock do not
    if (!stockAlreadyExists) {
      stockData = await findStockData(values.stock)

      if (!stockData) {
        return staticMessages.NOT_FOUND
      }

      await createStock(stockData, values.stock)

      await Wallet.findByIdAndUpdate(walletAlreadyExists._id, {
        stocks: [...walletAlreadyExists.stocks, {
          stock: values.stock,
          quantity: parseInt(values.quantity),
          price: parseFloat(formattedPrice)
        }]
      })

      return staticMessages.STOCK_CREATED
    }

    // check if stock already exists on chat wallet
    const stockIndex = await walletAlreadyExists.stocks.findIndex(s => s.stock === values.stock)

    // stock exists in db, but not included on wallet
    if (stockIndex === -1) {
      await Wallet.findByIdAndUpdate(walletAlreadyExists._id, {
        stocks: [...walletAlreadyExists.stocks, {
          stock: values.stock,
          quantity: parseInt(values.quantity),
          price: parseFloat(formattedPrice)
        }]
      })

      return staticMessages.STOCK_CREATED
    }

    // stock is included on wallet
    walletAlreadyExists.stocks[stockIndex] = {
      stock: values.stock,
      quantity: parseInt(values.quantity),
      price: parseFloat(formattedPrice)
    }
    await walletAlreadyExists.save()

    return staticMessages.STOCK_UPDATED
  }

  async listWalletById(chat_id) {
    const wallet = await Wallet.find({
      chat_id
    })

    const walletStocks = wallet[0].stocks
    const orderedStocks = walletStocks.sort(dynamicSort('price', 'desc'))

    if (!orderedStocks) throw Error('Ocorreu uma falha ao ordenar os ativos do chat=' + chat_id)

    const stocks = []

    if (!wallet[0]) {
      return 'Calma lá!\nCadastre pelo menos um ativo para utilizar funcionalidades da carteira.'
    }

    for (let index = 0; index < orderedStocks.length; index++) {
      if (index === 0) stocks.push('\n&#x1F4B0 <b>SUA CARTEIRA</b> \n\n' + '<code>ATIVO</code>\t\t\t\t\t\t\t\t<code>PM</code>\t\t\t\t\t\t\t\t\t\t\t\t<code>QNTD.</code> \n\n')
      const picked = (({ stock, price, quantity }) => `<code>${stock}${walletTabulation(stock.length, 'stock')}</code><code>R$${price}${walletTabulation((price.toString()).length, 'price')}</code><code>${quantity}</code>\n`)(wallet[0].stocks[index])
      stocks.push(picked)
    }

    return stocks.join('')
  }

  async listAllWallets() {
    const wallets = await Wallet.find({}).select('chat_id stocks -_id').populate('stocks')

    if (!wallets) throw Error('Ocorreu uma falha ao todas as carteiras cadastradas.')

    return wallets
  }
}

module.exports = new WalletRepository()
