const splitCommand = (text) => {
  const splittedText = text.split(' ')
  const cleanedCommands = splittedText.filter(element => element !== '')

  return cleanedCommands
}

module.exports = { splitCommand }
