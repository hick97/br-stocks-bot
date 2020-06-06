const { helpMenu, startMenu } = require('../repositories/MessageRepository')

const commandFunc = {
  '/start': startMenu,
  '/wallet': () => 'TODO',
  '/quotes': () => 'TODO',
  '/help': helpMenu
}

module.exports = commandFunc
