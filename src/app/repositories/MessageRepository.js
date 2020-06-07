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
      reply_to_message_id: message_id,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Some button text 1', callback_data: '1' }],
          [{ text: 'Some button text 2', callback_data: '2' }],
          [{ text: 'Some button text 3', callback_data: '3' }]
        ]
      })
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
