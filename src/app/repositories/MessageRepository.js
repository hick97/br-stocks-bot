const axios = require('axios')

const telegramApi = require('../services/api')
const commandOptions = require('../enum/commandOptions')
const { getKeyboardOptions } = require('../helpers/keyboardOptions')

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
        keyboard: getKeyboardOptions(),
        resize_keyboard: true,
        one_time_keyboard: true
      }),
      parse_mode: 'HTML'

    })
    return { chat_id, text }
  }

  async helpMenu() {
    return '<b>Instruções</b><br>'
  }

  async startMenu() {
    return 'Esse é o menu de início'
  }
}

module.exports = new MessageRepository()
