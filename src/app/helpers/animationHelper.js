
const animatedCommands = ['/start']

const needAnimation = (command = '') => animatedCommands.includes(command)

module.exports = { needAnimation }
