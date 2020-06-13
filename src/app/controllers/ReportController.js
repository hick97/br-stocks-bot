const { listAllWallets } = require('../repositories/WalletRepository')
const { listAllStocks } = require('../repositories/StockRepository')

const { buildReport, createDailyQuotes } = require('../repositories/ReportRepository')
const { sendMessage } = require('../repositories/MessageRepository')

class ReportController {
  async execute() {
    const subscriptions = await listAllWallets()
    const stocks = await listAllStocks()

    // create daily quotes for all stocks in db
    await createDailyQuotes(stocks)

    // create daily report to subscripted users
    for (let index = 0; index < subscriptions.length; index++) {
      const reportData = await buildReport(subscriptions[index].chat_id, subscriptions[index].stocks)
      await sendMessage(reportData.chat_id, reportData.message)
    }
  }
}

module.exports = new ReportController()
