const splitCommand = (text) => {
  const splittedText = text.split(' ')
  const cleanedCommands = splittedText.filter(element => element !== '' && element !== '@BRStocksBot')

  return cleanedCommands
}

const removeCommandFromText = (text, separator = ' ') => {
  const splittedText = splitCommand(text)
  const command = splittedText.shift()

  return {
    command,
    text: splittedText.join(separator)
  }
}

module.exports = { splitCommand, removeCommandFromText }
