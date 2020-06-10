const axios = require('axios')

const Api = require('../services/api')
const singleCommands = require('../enum/singleCommands')
const { getKeyboardOptions } = require('../helpers/keyboardOptions')

class MessageRepository {
  isSingleCommand(message) {
    const { text } = message
    const textIsValid = singleCommands.includes(text)

    return textIsValid
  }

  async sendMessage(chat_id, text, message_id = '') {
    await axios.post(`${Api.telegramURL}/sendMessage`, {
      chat_id,
      text,
      reply_to_message_id: message_id,
      parse_mode: 'HTML'

    })
  }
}

module.exports = new MessageRepository()
