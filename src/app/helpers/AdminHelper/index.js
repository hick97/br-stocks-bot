
const { sendCustomMessage } = require('../../repositories/MessageRepository')

const { useSentryLogger } = require('../LogHelper')
const { getCurrentDate } = require('../DateHelper')

const ADMINS = [680912149, 1059457054]
// const ADMIN = process.env.ADMIN_CHAT_ID

const sendMessageToAdmin = async ({ level, message }) => {
  const currentDate = getCurrentDate()
  const text =
    `${currentDate}\n\n` +
    `<b>levelname: ${level}</b>\n\n` +
    `<code>${message}</code>`

  try {
    for (let index = 0; index < ADMINS.length; index++) {
      const admin = ADMINS[index]
      await sendCustomMessage({ chat_id: admin, text })
    }
  } catch (error) {
    useSentryLogger(error, `Falha ao enviar mensagem para o ADMIN e text=${text}`)
  }
}

module.exports = { sendMessageToAdmin }
