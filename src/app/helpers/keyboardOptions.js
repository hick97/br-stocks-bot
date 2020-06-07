const commandOptions = require('../enum/commandOptions')

const getKeyboardOptions = () => {
  const keyboard = commandOptions.map((command) => ([{
    text: command
  }]))

  return keyboard
}

module.exports = { getKeyboardOptions }
