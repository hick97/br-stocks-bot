const { sendMessage, isSingleCommand } = require('../repositories/MessageRepository')
const { stockIsValid } = require('../repositories/StockRepository')
const { updateWallet, listWalletById } = require('../repositories/WalletRepository')

const singleCommands = require('../helpers/singleCommandsFunc')
const staticMessages = require('../enum/messages')

class MessageController {
  async execute(req, res) {
    try {
      const { message } = req.body

      if (!message) {
        throw Error('Ocorreceu um erro com a mensagem recebida, tente novamente em alguns instantes.')
      }

      let text = null
      text = (isSingleCommand(message)) && singleCommands[message.text]

      if (!text) {
        text = stockIsValid(message) && await updateWallet(message)
      }
      if (!text) {
        switch (message.text) {
          case '/wallet':
            text = await listWalletById(message.chat.id)
            break
          case '/details':
            text = 'TODO'
            break

          default:
            break
        }
      }
      if (!text) {
        text = staticMessages.INVALID_COMMAND
      }

      await sendMessage(message.chat.id, text, message.message_id)

      return res.json({ text })
    } catch (err) {
      res.end('Error: ' + err.message)
    }
  }
}

module.exports = new MessageController()
