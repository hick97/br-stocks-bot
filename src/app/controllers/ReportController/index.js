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
        const hasStocksOnWallet = stocks.length > 0

        if (shouldSendReport && hasStocksOnWallet) {
          const stocksReport = await buildSharePerfomance(stocks, hour)
          const walletReport = await buildWalletPerfomance(walletId, stocks, stocksReport, previousData, hour)

          const { stocks: stocksMessage, fiis, others, invalids } = stocksReport.message
          const { telegramText, whatsappText } = walletReport

          const messageOptions = {
            reply_markup: {
              inline_keyboard: [
                [{
                  text: '💰 Mais sobre sua carteira',
                  callback_data: '/partials'
                }],
                shareByWhatsapp(whatsappText)
              ]
            }
          }

          await sendCustomMessage({
            chat_id: currentChatId,
            text: telegramText,
            options: messageOptions
          })

          const hasStockMessage = !stocks.failed && !!stocksMessage.text
          const hasFiisMessage = !fiis.failed && !!fiis.text
          const hasOthersMessage = !others.failed && !!others.text

          hasStockMessage && await sendCustomMessage({ chat_id: currentChatId, text: stocksMessage.text, action: 'StockReport' })
          hasFiisMessage && await sendCustomMessage({ chat_id: currentChatId, text: fiis.text, action: 'FIIsReport' })
          hasOthersMessage && await sendCustomMessage({ chat_id: currentChatId, text: others.text, action: 'OthersReport' })

          invalids.length > 0 && await sendCustomMessage({ chat_id: currentChatId, text: '<b>INVÁLIDOS</b>\n\n' + invalids + alertMessages.support, action: 'InvalidsReport' })
        }
      }
      useSentryLogger(null, logMessages.finish)
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new ReportController()
