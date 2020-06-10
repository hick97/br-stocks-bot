
class ReportRepository {
  async buildReport(chat_id) {
    const report = {
      chat_id,
      message: 'esse é o relatório'
    }

    return report
  }
}
module.exports = new ReportRepository()
