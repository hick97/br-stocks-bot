const StockRepository = require('../repositories/StockRepository')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index]
      // console.log('criando stock quote: ' + stock)
      await StockRepository.createStock(stock.symbol, index)
      clearTimeout(1000 * 60)
    }
  }

  async buildReport(chat_id, stocks) {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
    var yyyy = today.getFullYear()

    today = '<b>&#x1F4C5 ' + dd + '/' + mm + '/' + yyyy + '</b>\n\n'
    const text = [today]

    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index]
      // console.log('Pegando dados do stock: ' + stock)
      const stockData = await StockRepository.getStockQuote(stock.symbol)
      const partial = `<b>${stock.stock}</b>\n<code>Volume</code>: <code>${stockData.volume}</code>\n<code>Máxima</code>: <code>${stockData.high}R$</code>\n<code>Mínima</code>: <code>${stockData.low}R$</code>\n<code>Abertura</code>: <code>${stockData.open}R$</code>\n<code>Fechamento</code>: <code>${stockData.price}R$</code>\n<code>Rentabilidade</code>: <code>${stockData.changePercent}</code>\n\n`
      text.push(partial)
    }
    const report = {
      chat_id,
      message: text.join('')
    }

    return report
  }
}
module.exports = new ReportRepository()
