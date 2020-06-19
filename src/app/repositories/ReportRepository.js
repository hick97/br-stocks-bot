const StockRepository = require('../repositories/StockRepository')
const reportHelper = require('../helpers/reportHelper')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].symbol
      await StockRepository.createStockQuote(stock, index)
      clearTimeout(1000 * 60)
    }
  }

  async buildReport(chat_id, stocks) {
    const text = []
    let sum = 0

    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index]
      const stockData = await StockRepository.getStockQuote(stock.stock)
      const partialText = await reportHelper.getStockReportText(stock.stock, stockData)
      text.push(partialText)
      sum += stockData.price * stock.quantity
    }
    const report = {
      chat_id,
      message: text.join(''),
      daily_result: sum
    }

    return report
  }

  async buildWalletReport(stocks, daily_result) {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
    var yyyy = today.getFullYear()

    today = '<b>&#x1F4C5 ' + dd + '/' + mm + '/' + yyyy + '</b>\n\n'

    let total = 0
    for (let index = 0; index < stocks.length; index++) {
      total += stocks[index].price * stocks[index].quantity
    }
    const ibovSymbol = 'BOVA11'
    const ibovData = await StockRepository.getStockQuote(ibovSymbol)

    const text = '<b>Resumo da Carteira</b>\n\n' +
      today +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseFloat(total).toFixed(2)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseFloat(daily_result).toFixed(2)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseFloat((daily_result - total) / total * 100).toFixed(2)}%</code>\n\n` +
      '<b>DIÁRIO</b>\n' +
      `<code>IBOVESPA:</code> <code>${ibovData.changePercent}</code>\n` +
      '<code>CARTEIRA:</code> <code>EM BREVE</code>\n'
    return text
  }
}
module.exports = new ReportRepository()
