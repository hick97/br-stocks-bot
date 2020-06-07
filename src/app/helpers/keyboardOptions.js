const commandOptions = require('../enum/singleCommands')

const getKeyboardOptions = () => {
  const keyboard = commandOptions.map((command) => ([{
    text: command
  }]))

  return keyboard
}

module.exports = { getKeyboardOptions }
