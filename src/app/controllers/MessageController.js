const { sendMessage, isSingleCommand } = require('../repositories/MessageRepository')
const { stockIsValid } = require('../repositories/StockRepository')
const singleCommands = require('../helpers/singleCommandsFunc')
const staticMessages = require('../enum/messages')

class MessageController {
  async execute(req, res) {
    try {
      const { message } = req.body

      if (!message) {
        throw Error('Ocorreceu um erro com a mensagem recebida, tente novamente em alguns instantes.')
      }

      let text = ''

      if (isSingleCommand(message)) {
        text = await singleCommands[message.text]()
      } else {
        if (stockIsValid(message)) {
          // TODO
          text = 'todo'
        } else {
          text = staticMessages.INVALID_COMMAND
        }
      }

      // await sendMessage(message.chat.id, text, message.message_id)

      return res.json({ text })
    } catch (err) {
      res.end('Error: ' + err.message)
    }
  }
}

module.exports = new MessageController()
