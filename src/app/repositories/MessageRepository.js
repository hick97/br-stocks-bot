const axios = require('axios')

const telegramApi = require('../services/api')
const commandOptions = require('../enum/commandOptions')

class MessageRepository {
  isCommandOption(message) {
    const { text } = message
    const textIsValid = commandOptions.includes(text)

    return textIsValid
  }

  async sendMessage(chat_id, text, message_id) {
    await axios.post(`${telegramApi.telegramURL}/sendMessage`, {
      chat_id,
      text,
      reply_to_message_id: message_id
    })
    return { chat_id, text }
  }

  async helpMenu() {
    return 'Esse é o menu de ajuda.'
  }

  async startMenu() {
    return 'Esse é o menu de início'
  }
}

module.exports = new MessageRepository()
