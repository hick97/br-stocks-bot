const { isSingleCommand } = require('../MessageRepository')

const singleCommands = require('../../helpers/singleCommandsFunc')

class ActionsRepository {
  async staticMessage(message) {
    return isSingleCommand(message) && singleCommands[message.text]
  }

  async handleWallet(message) { }
}

module.exports = new ActionsRepository()
