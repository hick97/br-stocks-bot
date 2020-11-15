const { stockIsValid } = require('../StockRepository')
const { isFundamentalsRequest } = require('../FundamentalsRepository')
const { updateWallet, listWalletById } = require('../WalletRepository')

const FundamentalsController = require('../../controllers/FundamentalsController')

const commandHelper = require('../../helpers/CommandHelper')

const { SingleCommands, SingleCommandsActions } = require('../../enum/CommandEnum')

class ActionsRepository {
  getAction(message) {
    const { text } = message
    const cleanedValues = commandHelper.splitCommand(text)
    const action = cleanedValues[0].trim()

    return action
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
    return await isFundamentalsRequest(message) && await FundamentalsController.execute(message)
  }
}

module.exports = new ActionsRepository()
