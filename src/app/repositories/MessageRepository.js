const axios = require('axios')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

const Api = require('../services/api')
const { useSentryLogger } = require('../helpers/LogHelper')

class MessageRepository {
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

  async sendCustomMessage({ chat_id, text, options }) {
    try {
      await axios.post(`${Api.telegramURL}/sendMessage`, {
        chat_id,
        text,
        parse_mode: 'HTML',
        ...options

      })
    } catch (error) {
      useSentryLogger(error, `Falha ao enviar mensagem para o chat_id=${chat_id} com o message_id=${options.message_id || 'null'} e text=${text}`)
    }
  }

  async sendGifAnimation({ chat_id, fileName }) {
    const formData = new FormData()
    const filePath = `${fileName}.mp4`
    const file = fs.createReadStream(path.resolve(__dirname, '..', 'assets', 'gifs', filePath))

    formData.append('animation', file, {
      filename: filePath
    })

    formData.append('chat_id', chat_id)

    const config = {
      headers: formData.getHeaders()
    }

    try {
      await axios.post(`${Api.telegramURL}/sendAnimation`, formData, config)
    } catch (error) {
      useSentryLogger(error, `Falha ao enviar animação para o chat_id=${chat_id}`)
    }
  }
}

module.exports = new MessageRepository()
