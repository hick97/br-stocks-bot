const { listWalletById } = require('../WalletRepository')
const { fundamentalsCommandIsValid } = require('../../helpers/FundamentalsHelper')

const WalletController = require('../../controllers/WalletController')
const FundamentalsController = require('../../controllers/FundamentalsController')

const { splitCommand } = require('../../helpers/CommandHelper')
const { validStockCommand } = require('../../helpers/StockHelper')

const { SingleCommands, SingleCommandsActions } = require('../../enum/CommandEnum')

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
}

module.exports = new ActionsRepository()
