const { listWalletById } = require('../WalletRepository')
const { sendNotificationToAll } = require('../NotificationRepository')

const WalletController = require('../../controllers/WalletController')
const FundamentalsController = require('../../controllers/FundamentalsController')

const { splitCommand, removeCommandFromText } = require('../../helpers/CommandHelper')
const { validStockCommand } = require('../../helpers/StockHelper')
const { fundamentalsCommandIsValid } = require('../../helpers/FundamentalsHelper')

const { SingleCommands, SingleCommandsActions } = require('../../enum/CommandEnum')
const { ErrorMessages } = require('../../enum/MessagesEnum')

class ActionsRepository {
  getAction(message) {
    const { text } = message
    const cleanedValues = splitCommand(text)
    const [action] = cleanedValues

    return action.trim()
  }

  async staticMessage(message) {
    const { text } = message
    const isSingleCommand = SingleCommands.includes(text)

    return isSingleCommand && SingleCommandsActions[text]
  }

  async handleWallet(message) {
    const { chat, text } = message
    const isWalletCommand = text === '/wallet'

    return isWalletCommand
      ? await listWalletById(chat.id)
      : validStockCommand(text) && await WalletController.execute(message)
  }

  async handleFundamentals(message) {
    const [firstCommandTerm] = splitCommand(message.text)
    return fundamentalsCommandIsValid(firstCommandTerm) && await FundamentalsController.execute(message)
  }

  async handleNotifications(message) {
    const { chat, text } = message

    if (chat.id != process.env.ADMIN_CHAT_ID) return ErrorMessages.ACCESS_DENIED

    const notification = removeCommandFromText(text) || ''
    return await sendNotificationToAll({ command: notification.command, text: notification.text })
  }
}

module.exports = new ActionsRepository()
