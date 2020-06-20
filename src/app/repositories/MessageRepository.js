const axios = require('axios')

const Api = require('../services/api')
const singleCommands = require('../enum/singleCommands')
const { useSentryLogger } = require('../helpers/exceptionHelper')

class MessageRepository {
  isSingleCommand(message) {
    const { text } = message
    const textIsValid = singleCommands.includes(text)

    return textIsValid
  }

  async sendMessage(chat_id, text, message_id = '') {
    try {
      await axios.post(`${Api.telegramURL}/sendMessage`, {
        chat_id,
        text,
        reply_to_message_id: message_id,
        parse_mode: 'HTML'
      })
    } catch (error) {
      useSentryLogger(error, `Falha ao enviar mensagem para o chat_id=${chat_id} com o message_id=${message_id || 'null'} e text=${text}`)
    }
  }
}

module.exports = new MessageRepository()
