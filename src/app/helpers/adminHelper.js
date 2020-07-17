const axios = require('axios')
const Api = require('../services/api')

const { useSentryLogger } = require('../helpers/exceptionHelper')

const ADMIN_ID = 680912149

const sendMessageToAdmin = async (level, message) => {
  const text = `${level} - ${message}`
  try {
    await axios.post(`${Api.telegramURL}/sendMessage`, {
      chat_id: ADMIN_ID,
      text,
      parse_mode: 'HTML'
    })
  } catch (error) {
    useSentryLogger(error, `Falha ao enviar mensagem para o ADMIN e text=${text}`)
  }
}

module.exports = { sendMessageToAdmin }
