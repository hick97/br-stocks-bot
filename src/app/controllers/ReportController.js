const { listAllWallets } = require('../repositories/WalletRepository')
const { listAllStocks } = require('../repositories/StockRepository')
const { sendMessage } = require('../repositories/MessageRepository')
const { buildReport, buildWalletReport, createDailyQuotes } = require('../repositories/ReportRepository')

const { useSentryLogger } = require('../helpers/exceptionHelper')

class ReportController {
  async execute() {
    try {
      const subscriptions = await listAllWallets()
      const allStocks = await listAllStocks()

      // create daily quotes for all stocks in db
      await createDailyQuotes(allStocks)

      // create daily report to subscripted users
      for (let index = 0; index < subscriptions.length; index++) {
        let stocksReport = null
        let walletReport = null
        // if (subscriptions[index].chat_id === 680912149) {
        stocksReport = await buildReport(subscriptions[index].chat_id, subscriptions[index].stocks)
        walletReport = await buildWalletReport(subscriptions[index].stocks, stocksReport)
        // }

        // console.log(stocksReport)
        // if (subscriptions[index].chat_id === 680912149) {
        // await sendMessage(680912149, walletReport)
        const { stocks, fiis, others } = stocksReport.message

        await sendMessage(subscriptions[index].chat_id, walletReport)
        stocks.length > 0 && await sendMessage(stocksReport.chat_id, stocks)
        fiis.length > 0 && await sendMessage(stocksReport.chat_id, fiis)
        others.length > 0 && await sendMessage(stocksReport.chat_id, '<b>OUTROS</b>\n\n' + others + '<code>Atenção: Até o momento, o @brstocksbot suporta apenas as seguintes classes de ativos: AÇÕES ou Fundo de Investimento Imobiliário. Em breve daremos suporte a ETFs também &#x1F916</code>')

        // await sendMessage(680912149, stocksReport.message)
        // }
      }
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new ReportController()
