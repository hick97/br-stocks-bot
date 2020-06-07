const { helpMenu } = require('../repositories/MessageRepository')
const staticMessages = require('../enum/messages')

const commandFunc = {
  '/start': () => staticMessages.START_MESSAGE,
  '/wallet': () => 'TODO',
  '/quotes': () => 'TODO',
  '/help': helpMenu
}

module.exports = commandFunc
