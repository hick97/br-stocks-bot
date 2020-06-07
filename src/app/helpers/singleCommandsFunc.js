const staticMessages = require('../enum/messages')

const singleCommandsFunc = {
  '/start': () => staticMessages.START_MESSAGE,
  '/wallet': () => 'TODO',
  '/details': () => 'TODO',
  '/help': () => staticMessages.HELP_MESSAGE
}

module.exports = singleCommandsFunc
