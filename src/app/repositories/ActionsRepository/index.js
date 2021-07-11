const { listWalletById, getWalletPartials } = require('../WalletRepository')
const { sendNewsNotificationToAll } = require('../NotificationRepository')

const WalletController = require('../../controllers/WalletController')
const FundamentalsController = require('../../controllers/FundamentalsController')

const { splitCommand, removeCommandFromText } = require('../../helpers/CommandHelper')
const { validStockCommand } = require('../../helpers/StockHelper')
const { fundamentalsCommandIsValid } = require('../../helpers/FundamentalsHelper')

const { SingleCommands, SingleCommandsActions } = require('../../enum/CommandEnum')
const { ErrorMessages } = require('../../enum/MessagesEnum')

const getCommandAction = (text) => {
  const cleanedValues = splitCommand(text)
  const [action] = cleanedValues

  return action.trim()
}

class ActionsRepository {
  getAction(message) {
    const { text } = message
    return getCommandAction(text)
  }

  async staticMessage(message) {
    const { text } = message
    const isSingleCommand = SingleCommands.includes(text)

    return isSingleCommand && SingleCommandsActions[text]
  }

  async handleWallet(message) {
    const { chat, text } = message

    const funcByWalletCommands = {
      '/wallet': listWalletById,
      '/partials': getWalletPartials
    }

    const command = getCommandAction(text)

    const funcKeys = Object.keys(funcByWalletCommands)
    const withChatId = funcKeys.includes(command)

    if (withChatId) return await funcByWalletCommands[command](chat.id)

    return validStockCommand(text) && await WalletController.execute(message)
  }

  async handleFundamentals(message) {
    const [firstCommandTerm] = splitCommand(message.text)
    return fundamentalsCommandIsValid(firstCommandTerm) && await FundamentalsController.execute(message)
  }

  async handleNotifications(message) {
    const { chat, text } = message

    if (chat.id != process.env.ADMIN_CHAT_ID) return ErrorMessages.ACCESS_DENIED

    const notification = removeCommandFromText(text) || ''
    return await sendNewsNotificationToAll({ command: notification.command, text: notification.text })
  }
}

module.exports = new ActionsRepository()
