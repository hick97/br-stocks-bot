const { buildReport, getReport, getSubscriptions } = require('../repositories/ReportRepository')
const { sendMessage } = require('../repositories/MessageRepository')

class ReportController {
  async execute() {
    const subscriptions = await getSubscriptions()

    for (let index = 0; index < subscriptions.length; index++) {
      const reportData = await buildReport(subscriptions[index])
      const reportMessage = await getReport(reportData)
      await sendMessage(reportData.chat_id, reportMessage)
    }
  }
}

module.exports = new ReportController()
