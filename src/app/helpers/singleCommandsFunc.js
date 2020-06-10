const staticMessages = require('../enum/messages')

const singleCommandsFunc = {
  '/start': staticMessages.START_MESSAGE,
  '/help': staticMessages.HELP_MESSAGE
}

module.exports = singleCommandsFunc
