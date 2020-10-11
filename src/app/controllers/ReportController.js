const { listAllWallets } = require('../repositories/WalletRepository')
const { listAllStocks } = require('../repositories/StockRepository')
const { sendMessage, sendCustomMessage } = require('../repositories/MessageRepository')
const { buildReport, buildWalletReport, createDailyQuotes } = require('../repositories/ReportRepository')
const { getInvalidDailies } = require('../repositories/DailyRepository')

const { useSentryLogger } = require('../helpers/exceptionHelper')
const { getCurrentDate } = require('../helpers/reportHelper')

class ReportController {
  async execute() {
    try {
      const subscriptions = await listAllWallets()
      const allStocks = await listAllStocks()

      // create daily quotes for all stocks in db
      useSentryLogger(null, `Starting daily quotes on ${getCurrentDate({ withHTML: false })}...`)
      await createDailyQuotes(allStocks)

      // retry failed quotes
      const failedQuotes = await getInvalidDailies(false)
      const quotesToRetry = failedQuotes.map(({ symbol: stock }) => ({ stock }))
      await createDailyQuotes(quotesToRetry)

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

        const reply_markup = {
          inline_keyboard: [
            [{
              text: 'Compartilhar - Whatsapp',
              url: `https://api.whatsapp.com/send?text=${walletReport.whatsappText}`
            }]
          ]
        }

        await sendCustomMessage({ chat_id: subscriptions[index].chat_id, text: walletReport.telegramText, options: { reply_markup } })
        stocks.length > 0 && await sendMessage(stocksReport.chat_id, stocks)
        fiis.length > 0 && await sendMessage(stocksReport.chat_id, fiis)
        others.length > 0 && await sendMessage(stocksReport.chat_id, '<b>OUTROS</b>\n\n' + others + '<code>Atenção: Até o momento, o @brstocksbot suporta apenas as seguintes classes de ativos: AÇÕES ou Fundo de Investimento Imobiliário. Em breve daremos suporte a ETFs também &#x1F916</code>')

        // await sendMessage(680912149, stocksReport.message)
        useSentryLogger(null, `All reports were sent on ${getCurrentDate({ withHTML: false })}...`)

        // }
      }
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new ReportController()
