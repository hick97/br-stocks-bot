const staticMessages = require('../enum/messages')

const commandFunc = {
  '/start': () => staticMessages.START_MESSAGE,
  '/wallet': () => 'TODO',
  '/details': () => 'TODO',
  '/help': () => staticMessages.HELP_MESSAGE
}

module.exports = commandFunc
