const { sendMessage, isCommandOption } = require('../repositories/MessageRepository')
const commandFunc = require('../helpers/commandFunc')

class MessageController {
  async execute(req, res) {
    try {
      const { message } = req.body

      if (!message) {
        throw Error('Ocorreceu um erro, tente novamente em alguns instantes.')
      }

      const text = isCommandOption(message) ? await commandFunc[message.text]() : 'Checar se é um ativo'
      await sendMessage(message.chat.id, text, message.message_id)

      return res.json({ text })
    } catch (err) {
      res.end('Ocorreu um erro, tente novamente. Para mais informações utilize o comando /help. Error: ' + err.message)
    }
  }
}

module.exports = new MessageController()
