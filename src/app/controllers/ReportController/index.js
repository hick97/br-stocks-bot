const { listAllStocks } = require('../../repositories/StockRepository')
const { listAllWallets } = require('../../repositories/WalletRepository')
const { getInvalidDailies } = require('../../repositories/DailyRepository')
const { sendCustomMessage } = require('../../repositories/MessageRepository')
const { scrappyBenchmarks, scrappyLastStockDataUpdate } = require('../../repositories/ScrappyRepository')

const { buildWalletPerfomance, buildSharePerfomance, createDailyQuotes } = require('../../repositories/ReportRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { shareByWhatsapp } = require('../../helpers/SocialHelper')
const { isWeekend } = require('../../helpers/DateHelper')

const { logMessages, alertMessages } = require('./utils/reportUtils')

class ReportController {
  async execute() {
    try {
      const isDebug = process.env.NODE_ENV === 'development'

      if (isWeekend() && !isDebug) return

      const subscriptions = await listAllWallets()
      const allStocks = await listAllStocks()

      // create daily quotes for all stocks in db
      useSentryLogger(null, logMessages.start)
      await createDailyQuotes(allStocks)

      // retry failed quotes
      const failedQuotes = await getInvalidDailies()
      const quotesToRetry = failedQuotes.map(({ symbol: stock }) => ({ stock }))
      await createDailyQuotes(quotesToRetry, true)

      const { hour } = await scrappyLastStockDataUpdate()
      await scrappyBenchmarks()

      // create daily report to subscripted users
      for (let index = 0; index < subscriptions.length; index++) {
        const { _id: walletId, chat_id, stocks, previousData } = subscriptions[index]
        const currentChatId = isDebug ? process.env.ADMIN_CHAT_ID : chat_id
        const shouldSendReport = currentChatId == chat_id

        if (shouldSendReport) {
          const stocksReport = await buildSharePerfomance(stocks, hour)
          const walletReport = await buildWalletPerfomance(walletId, stocks, stocksReport, previousData, hour)

          const { stocks: stocksMessage, fiis, others, invalids } = stocksReport.message
          const { telegramText, whatsappText } = walletReport

          await sendCustomMessage({ chat_id: currentChatId, text: telegramText, options: { reply_markup: shareByWhatsapp(whatsappText) } })

          !stocks.failed && await sendCustomMessage({ chat_id: currentChatId, text: stocksMessage.text })
          !fiis.failed && await sendCustomMessage({ chat_id: currentChatId, text: fiis.text })
          !others.failed && await sendCustomMessage({ chat_id: currentChatId, text: others.text })

          invalids.length > 0 && await sendCustomMessage({ chat_id: currentChatId, text: '<b>INVÁLIDOS</b>\n\n' + invalids + alertMessages.support })
        }
      }
      useSentryLogger(null, logMessages.finish)
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new ReportController()
