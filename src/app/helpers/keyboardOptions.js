const { SingleCommands } = require('../enum/CommandEnum')

const getKeyboardOptions = () => {
  const keyboard = SingleCommands.map((command) => ([{
    text: command
  }]))

  return keyboard
}

module.exports = { getKeyboardOptions }
