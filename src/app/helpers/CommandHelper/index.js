const splitCommand = (text) => {
  const splittedText = text.split(' ')
  const cleanedCommands = splittedText.filter(element => element !== '')

  return cleanedCommands
}

const removeCommandFromText = (text, separator = ' ') => {
  const splittedText = splitCommand(text)
  splittedText.shift()

  return splittedText.join(separator)
}

module.exports = { splitCommand, removeCommandFromText }
