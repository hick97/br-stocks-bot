const { sendGifAnimation, sendCustomMessage } = require('../../repositories/MessageRepository')
const Actions = require('../../repositories/ActionsRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { getAnimationFile } = require('../../helpers/AnimationHelper')

const { ErrorMessages } = require('../../enum/MessagesEnum')

class MessageController {
  async execute(req, res) {
    const { message, edited_message, callback_query } = req.body
    const command = message || edited_message || null

    console.log(callback_query.message.chat.id)

    if (!command) {
      await sendCustomMessage(
        {
          text: 'Cadastre um ativo:',
          chat_id: callback_query.message.chat.id
        }
      )

      return res.json({ result: 'OK' })
    }

    const AdminActionsHandler = {
      '/sendtoall': Actions.handleNotifications,
      '/sendtome': Actions.handleNotifications
    }

    const ActionsHandler = {
      '/start': Actions.staticMessage,
      '/help': Actions.staticMessage,
      '/stock': Actions.handleWallet,
      '/wallet': Actions.handleWallet,
      '/del': Actions.handleWallet,
      '/fundamentals': Actions.handleFundamentals,
      ...AdminActionsHandler,
      default: () => ErrorMessages.INVALID_COMMAND
    }

    try {
      const action = Actions.getAction(command)
      const actionHandler = ActionsHandler[action] || ActionsHandler.default
      const response = await actionHandler(command)

      await sendCustomMessage(
        {
          text: response,
          chat_id: command.chat.id,
          message_id: command.message_id,
          options: {
            reply_markup: {
              inline_keyboard: [
                [{
                  text: 'Teste 1',
                  callback_data: 'command1'
                }]
              ]
            }
          }
        }
      )

      const fileName = getAnimationFile(command.text)
      !!fileName && await sendGifAnimation({
        chat_id: command.chat.id,
        fileName
      })

      return res.json({ result: response })
    } catch (err) {
      useSentryLogger(err)
      return res.json({ error: err.message })
    }
  }
}

module.exports = new MessageController()
