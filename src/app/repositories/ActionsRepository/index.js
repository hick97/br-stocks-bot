const { stockIsValid } = require('../StockRepository')
const { fundamentalsCommandIsValid } = require('../../helpers/FundamentalsHelper')
const { updateWallet, listWalletById } = require('../WalletRepository')

const FundamentalsController = require('../../controllers/FundamentalsController')

const commandHelper = require('../../helpers/CommandHelper')

const { SingleCommands, SingleCommandsActions } = require('../../enum/CommandEnum')

class ActionsRepository {
  getAction(message) {
    const { text } = message
    const cleanedValues = commandHelper.splitCommand(text)
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
      : stockIsValid(message) && await updateWallet(message)
  }

  async handleFundamentals(message) {
    const [firstCommandTerm] = commandHelper.splitCommand(message.text)
    return fundamentalsCommandIsValid(firstCommandTerm) && await FundamentalsController.execute(message)
  }
}

module.exports = new ActionsRepository()
