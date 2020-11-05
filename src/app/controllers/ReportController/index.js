const { listAllStocks } = require('../../repositories/StockRepository')
const { listAllWallets } = require('../../repositories/WalletRepository')
const { getInvalidDailies } = require('../../repositories/DailyRepository')
const { sendMessage, sendCustomMessage } = require('../../repositories/MessageRepository')
const { buildReport, buildWalletReport, createDailyQuotes } = require('../../repositories/ReportRepository')

const { useSentryLogger } = require('../../helpers/exceptionHelper')
const { shareByWhatsapp } = require('../../helpers/ReportHelper')

const { logMessages, alertMessages } = require('./utils/reportUtils')

class ReportController {
  async execute() {
    try {
      const isDebug = process.env.NODE_ENV === 'development'
      const subscriptions = await listAllWallets()
      const allStocks = await listAllStocks()

      // create daily quotes for all stocks in db
      useSentryLogger(null, logMessages.start)
      await createDailyQuotes(allStocks)

      // retry failed quotes
      const failedQuotes = await getInvalidDailies(false)
      const quotesToRetry = failedQuotes.map(({ symbol: stock }) => ({ stock }))
      await createDailyQuotes(quotesToRetry)

      // create daily report to subscripted users
      for (let index = 0; index < subscriptions.length; index++) {
        const { chat_id, stocks } = subscriptions[index]
        const currentChatId = isDebug ? process.env.ADMIN_CHAT_ID : chat_id
        const shouldSendReport = currentChatId == chat_id

        if (shouldSendReport) {
          const stocksReport = await buildReport(stocks)
          const walletReport = await buildWalletReport(stocks, stocksReport)

          const { stocks: stocksMessage, fiis, others } = stocksReport.message
          const { telegramText, whatsappText } = walletReport

          await sendCustomMessage({ chat_id: currentChatId, text: telegramText, options: { reply_markup: shareByWhatsapp(whatsappText) } })
          stocks.length > 0 && await sendMessage(currentChatId, stocksMessage)
          fiis.length > 0 && await sendMessage(currentChatId, fiis)
          others.length > 0 && await sendMessage(currentChatId, '<b>OUTROS</b>\n\n' + others + alertMessages.support)

          useSentryLogger(null, logMessages.finish)
        }
      }
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new ReportController()