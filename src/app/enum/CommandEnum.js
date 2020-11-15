const { GeneralMessages } = require('../enum/MessagesEnum')

const SingleCommands = [
  '/start',
  '/wallet',
  '/details',
  '/help'
]

const SingleCommandsActions = {
  '/start': GeneralMessages.START_MESSAGE,
  '/help': GeneralMessages.HELP_MESSAGE
}

module.exports = { SingleCommands, SingleCommandsActions }
