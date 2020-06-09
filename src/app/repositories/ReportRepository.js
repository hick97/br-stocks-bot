class ReportRepository {
  async getSubscriptions() {
    return [680912149]
  }

  async buildReport(chat_id) {
    const report = {
      chat_id,
      message: 'esse é o relatório'
    }

    return report
  }

  async getReport(data) {
    return `Enviando a mensagem: ${data.message} para o chat_id: ${data.chat_id}`
  }
}
module.exports = new ReportRepository()
