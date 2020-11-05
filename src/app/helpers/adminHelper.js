const axios = require('axios')
const Api = require('../services/api')

const { useSentryLogger } = require('../helpers/exceptionHelper')
const { getCurrentDate } = require('./ReportHelper')

const ADMINS = [680912149, 1059457054]
// const ADMINS = [680912149]

const sendMessageToAdmin = async (level, message) => {
  const text =
    `${getCurrentDate({ withHTML: true })}\n\n` +
    `<b>levelname: ${level}</b>\n\n` +
    `<code>${message}</code>`

  try {
    for (let index = 0; index < ADMINS.length; index++) {
      const admin = ADMINS[index]
      await axios.post(`${Api.telegramURL}/sendMessage`, {
        chat_id: admin,
        text,
        parse_mode: 'HTML'
      })
    }
  } catch (error) {
    useSentryLogger(error, `Falha ao enviar mensagem para o ADMIN e text=${text}`)
  }
}

module.exports = { sendMessageToAdmin }
