const { listAllWallets } = require('../WalletRepository')
const { sendCustomMessage } = require('../MessageRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')

const { NotificationMessages } = require('../../enum/MessagesEnum')

class NotificationRepository {
  async sendNotificationToAll({ text, options }) {
    try {
      const isDebug = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'development'
      const subscriptions = await listAllWallets()

      const successMessage = 'Mensagem enviada com sucesso!'

      const notificationMessage =
        NotificationMessages.NOTIFICATION_HEADER +
        NotificationMessages.APP_VERSION + '<code>' + text + '</code>' +
        NotificationMessages.NOTIFICATION_FOOTER

      for (let index = 0; index < subscriptions.length; index++) {
        const { chat_id } = subscriptions[index]
        const currentChatId = isDebug ? process.env.ADMIN_CHAT_ID : chat_id
        const shouldSendReport = currentChatId == chat_id

        if (shouldSendReport) await sendCustomMessage({ chat_id: currentChatId, text: notificationMessage, options })
      }

      return successMessage
    } catch (error) {
      const errorMessage = 'Falha ao enviar mensagem para todos os usuários'
      useSentryLogger(error, errorMessage)
      return errorMessage
    }
  }
}

module.exports = new NotificationRepository()
