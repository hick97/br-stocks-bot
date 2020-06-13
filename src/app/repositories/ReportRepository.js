const StockRepository = require('../repositories/StockRepository')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].symbol
      await StockRepository.createStockQuote(stock, index)
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
      const stockData = await StockRepository.getStockQuote(stock.stock)
      const partial = `<b>${stock.stock}</b>\n<code>Volume</code>: <code>${stockData.volume}</code>\n<code>Máxima</code>: <code>R$ ${stockData.high}</code>\n<code>Mínima</code>: <code>R$ ${stockData.low}</code>\n<code>Abertura</code>: <code>R$ ${stockData.open}</code>\n<code>Fechamento</code>: <code>R$ ${stockData.price}</code>\n<code>Rentabilidade</code>: <code>${stockData.changePercent}</code>\n\n`
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
