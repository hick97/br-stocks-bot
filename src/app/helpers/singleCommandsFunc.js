const { GeneralMessages } = require('../enum/MessagesEnum')

const singleCommandsFunc = {
  '/start': GeneralMessages.START_MESSAGE,
  '/help': GeneralMessages.HELP_MESSAGE
}

module.exports = singleCommandsFunc
