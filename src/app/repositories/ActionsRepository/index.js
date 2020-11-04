const { stockIsValid } = require('../StockRepository')
const { updateWallet, listWalletById } = require('../WalletRepository')
const { isSingleCommand } = require('../MessageRepository')
const { isFundamentalsRequest } = require('../FundamentalsRepository')

const FundamentalsController = require('../../controllers/FundamentalsController')

const singleCommands = require('../../helpers/singleCommandsFunc')
const commandHelper = require('../../helpers/CommandHelper')

class ActionsRepository {
  getAction(message) {
    const { text } = message
    const cleanedValues = commandHelper.splitCommand(text)
    const action = cleanedValues[0].trim()

    return action
  }

  async staticMessage(message) {
    return isSingleCommand(message) && singleCommands[message.text]
  }

  async handleWallet(message) {
    return message.text === '/wallet'
      ? await listWalletById(message.text)
      : stockIsValid(message) && await updateWallet(message)
  }

  async handleFundamentals(message) {
    return await isFundamentalsRequest(message) && await FundamentalsController.execute(message)
  }
}

module.exports = new ActionsRepository()
