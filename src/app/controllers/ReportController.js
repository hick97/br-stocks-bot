const { listAllWallets } = require('../repositories/WalletRepository')
const { buildReport } = require('../repositories/ReportRepository')
const { sendMessage } = require('../repositories/MessageRepository')

class ReportController {
  async execute() {
    const subscriptions = await listAllWallets()

    for (let index = 0; index < subscriptions.length; index++) {
      const reportData = await buildReport(subscriptions[index].chat_id, subscriptions[index].stocks)
      await sendMessage(reportData.chat_id, reportData.message)
    }
  }
}

module.exports = new ReportController()
