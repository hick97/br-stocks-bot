const Wallet = require('../../models/Wallet')

const { listAllWallets } = require('../WalletRepository')
const { sendCustomMessage } = require('../MessageRepository')
const { getEarningsWithDatePaymentEqualsToday } = require('../EarningsRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { parseToCleanedFloat } = require('../../helpers/CurrencyHelper')

const { NotificationMessages } = require('../../enum/MessagesEnum')
const { emojis } = require('../../enum/EmojiEnum')

class NotificationRepository {
  async sendNewsNotificationToAll({ command, text, options }) {
    try {
      const isDebug = process.env.NODE_ENV === 'development' || command === '/sendtome'
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

  async sendDividendsNotification() {
    const isDebug = process.env.NODE_ENV !== 'production'

    const earningsToSendMessage = await getEarningsWithDatePaymentEqualsToday()
    const codesToSendMessage = earningsToSendMessage.map(e => e.code)

    const getEarningDataByCode = (code) => earningsToSendMessage.filter(e => e.code === code)

    const getEarningMessageHeader = (dividendsData) => {
      const codes = dividendsData.map(data => data.earning.code)

      const estimatedValue = dividendsData.reduce((acc, data) => acc + (parseToCleanedFloat(data.earning.resultAbsoluteValue).toFixed(8) * data.quantity), 0)

      return `<b>Hoje é dia de proventos!</b> ${emojis.partyPopper}\n` +
        `<code>${codes.join(', ')}!</code>\n` +
        `<code>R$${estimatedValue.toFixed(2)}!</code>\n\n`
    }

    const getMessageAlertByCodes = (dividendsData) => dividendsData.map(dividend => {
      const { earning, quantity } = dividend

      const formattedResult = parseToCleanedFloat(earning.resultAbsoluteValue)

      return `<b>${earning.code}</b>\n` +
        `<code>${(earning.earningType).toUpperCase()}</code>\n` +
        `<code>${emojis.calendar} ELEGÍVEL - ${earning.limitDate}</code>\n` +
        `<code>${emojis.bankNote} POR COTA - R$${formattedResult.toFixed(4)}  </code>\n` +
        `<code>${emojis.moneyBag} ESTIMADO - R$${(formattedResult.toFixed(8) * quantity).toFixed(4)} </code>\n\n`
    })

    const walletsToSendMessage = await Wallet.find({
      'stocks.stock': { $in: codesToSendMessage }
    })

    for (let index = 0; index < walletsToSendMessage.length; index++) {
      const currentWallet = walletsToSendMessage[index]

      const dataToSendMessage = currentWallet.stocks.map(s => {
        const hasToSendMessage = codesToSendMessage.includes(s.stock)
        if (hasToSendMessage) {
          const [earningData] = getEarningDataByCode(s.stock)
          return {
            earning: earningData,
            quantity: s.quantity
          }
        }
      })

      const cleanedData = dataToSendMessage.filter(data => !!data)
      const messageHeader = getEarningMessageHeader(cleanedData)
      const message = getMessageAlertByCodes(cleanedData)

      const currentChatId = isDebug ? process.env.ADMIN_CHAT_ID : currentWallet.chat_id
      const shouldSendReport = currentChatId == currentWallet.chat_id

      if (shouldSendReport) await sendCustomMessage({ text: messageHeader + message.join(''), chat_id: currentChatId })
    }
  }
}

module.exports = new NotificationRepository()
