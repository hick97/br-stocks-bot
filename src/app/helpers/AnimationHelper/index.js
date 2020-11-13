
const fileByCommand = {
  '/start': 'gif-start'
}

const getAnimationFile = (command = '') => fileByCommand[command] || null

module.exports = { getAnimationFile }
