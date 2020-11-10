const { sendMessage, sendGifAnimation } = require('../../repositories/MessageRepository')

const Actions = require('../../repositories/ActionsRepository')

const { useSentryLogger } = require('../../helpers/exceptionHelper')
const { needAnimation } = require('../../helpers/animationHelper')

const { ErrorMessages } = require('../../enum/MessagesEnum')

class MessageController {
  async execute(req, res) {
    const { message, edited_message } = req.body
    const command = message || edited_message || null

    const ActionsHandler = {
      '/start': Actions.staticMessage,
      '/help': Actions.staticMessage,
      '/stock': Actions.handleWallet,
      '/wallet': Actions.handleWallet,
      '/del': Actions.handleWallet,
      '/fundamentals': Actions.handleFundamentals,
      default: ErrorMessages.INVALID_COMMAND
    }

    try {
      const action = Actions.getAction(command)
      const response = await ActionsHandler[action](command) || ActionsHandler.default

      await sendMessage(command.chat.id, response, command.message_id)
      needAnimation(command.text) && await sendGifAnimation({
        chat_id: command.chat.id,
        fileName: 'gif-start'
      })

      return res.json({ result: response })
    } catch (err) {
      useSentryLogger(err)
      return res.json({ error: err.message })
    }
  }
}

module.exports = new MessageController()
