const { sendMessage, sendGifAnimation } = require('../repositories/MessageRepository')
const { stockIsValid } = require('../repositories/StockRepository')
const { isFundamentalsRequest } = require('../repositories/FundamentalsRepository')
const { updateWallet, listWalletById } = require('../repositories/WalletRepository')

const FundamentalsController = require('./FundamentalsController')

const { useSentryLogger } = require('../helpers/exceptionHelper')
const { needAnimation } = require('../helpers/animationHelper')

const staticMessages = require('../enum/messages')

const Actions = require('../repositories/ActionsRepository')

class MessageController {
  async execute(req, res) {
    let { message, edited_message } = req.body
    let text = null

    try {
      if (!message) message = edited_message
      if (!message) throw Error('Ocorreceu um erro com a mensagem recebida, tente novamente em alguns instantes.')

      // Done
      text = await Actions.staticMessage(message)

      if (text) {
        await sendMessage(message.chat.id, text, message.message_id)
        needAnimation(message.text) && await sendGifAnimation({
          chat_id: message.chat.id,
          fileName: 'gif-start'
        })
        return res.json({ text })
      }

      // TODO
      text = stockIsValid(message) && await updateWallet(message)
      if (text) {
        await sendMessage(message.chat.id, text, message.message_id)
        return res.json({ text })
      }

      text = await isFundamentalsRequest(message) && await FundamentalsController.execute(message)

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
      // message && await sendMessage(message.chat.id, staticMessages.ERROR_MESSAGE)
      return res.json({ error: err.message })
    }
  }
}

module.exports = new MessageController()
