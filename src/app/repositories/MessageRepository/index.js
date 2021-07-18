const axios = require('axios')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

const Api = require('../../services/api')

const { useSentryLogger } = require('../../helpers/LogHelper')

class MessageRepository {
  async sendCustomMessage({ chat_id, text, message_id, options, action }) {
    try {
      await axios.post(`${Api.telegramURL}/sendMessage`, {
        text,
        chat_id,
        parse_mode: 'HTML',
        reply_to_message_id: message_id || '',
        ...options
      })
    } catch (error) {
      if (process.env.WITH_ADMIN_DEBUG && error.response && action) {
        const adminText =
        '<b>levelname: ERROR</b>\n\n' +
        `<b>CHAT_ID = </b><code>${chat_id}</code>\n` +
        `<b>ACTION = </b><code>${action}</code>\n` +
        `<b>STATUS = </b><code>${error.response.status}(${error.response.statusText})</code>\n\n` +
        `<b>DESCRIPTION</b>\n<code>${error.response.data.description}</code>\n`

        await axios.post(`${Api.telegramURL}/sendMessage`, {
          text: adminText,
          chat_id: process.env.ADMIN_CHAT_ID,
          parse_mode: 'HTML'
        })
      }

      useSentryLogger(error, `Falha ao enviar mensagem para o chat_id=${chat_id} e text=${text}`)
    }
  }

  async sendGifAnimation({ chat_id, fileName }) {
    const formData = new FormData()
    const formattedFileName = `${fileName}.mp4`
    const filePath = path.resolve(__dirname, '..', '..', 'assets', 'gifs', formattedFileName)
    const file = fs.createReadStream(filePath)

    formData.append('animation', file, {
      filename: formattedFileName
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
