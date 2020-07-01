const { sendMessage, isSingleCommand } = require('../repositories/MessageRepository')
const { stockIsValid } = require('../repositories/StockRepository')
const { updateWallet, listWalletById } = require('../repositories/WalletRepository')

const { useSentryLogger } = require('../helpers/exceptionHelper')
const singleCommands = require('../helpers/singleCommandsFunc')
const staticMessages = require('../enum/messages')

class MessageController {
  async execute(req, res) {
    let { message, edited_message } = req.body
    let text = null

    try {
      if (!message) message = edited_message
      if (!message) throw Error('Ocorreceu um erro com a mensagem recebida, tente novamente em alguns instantes.')

      text = (isSingleCommand(message)) && singleCommands[message.text]
      if (text) {
        await sendMessage(message.chat.id, text, message.message_id)
        return res.json({ text })
      }

      text = stockIsValid(message) && await updateWallet(message)
      if (text) {
        await sendMessage(message.chat.id, text, message.message_id)
        return res.json({ text })
      }

      switch (message.text) {
        case '/wallet':
          text = await listWalletById(message.chat.id)
          break

        default:
          text = staticMessages.INVALID_COMMAND
          break
      }

      await sendMessage(message.chat.id, text, message.message_id)
      return res.json({ text })
    } catch (err) {
      useSentryLogger(err)
      message && await sendMessage(message.chat.id, staticMessages.ERROR_MESSAGE)
      return res.status(400).json({ error: err.message })
    }
  }
}

module.exports = new MessageController()
