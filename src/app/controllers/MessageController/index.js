const { sendGifAnimation, sendCustomMessage } = require('../../repositories/MessageRepository')
const { updateCommandCount } = require('../../repositories/TrackRepository')
const Actions = require('../../repositories/ActionsRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { getAnimationFile } = require('../../helpers/AnimationHelper')

const { ErrorMessages } = require('../../enum/MessagesEnum')

class MessageController {
  async execute(req, res) {
    const { message, edited_message, callback_query } = req.body

    const formattedCallback = (callback) => ({
      text: callback.data,
      chat: callback.message.chat
    })

    const callbackMessage = callback_query ? formattedCallback(callback_query) : null
    const command = message || edited_message || callbackMessage || null

    const AdminActionsHandler = {
      '/sendtoall': Actions.handleNotifications,
      '/sendtome': Actions.handleNotifications
    }

    const ActionsHandler = {
      '/start': Actions.staticMessage,
      '/help': Actions.staticMessage,
      '/stock': Actions.handleWallet,
      '/wallet': Actions.handleWallet,
      '/partials': Actions.handleWallet,
      '/del': Actions.handleWallet,
      '/fundamentals': Actions.handleFundamentals,
      ...AdminActionsHandler,
      default: () => ErrorMessages.INVALID_COMMAND
    }

    const optionsByCommand = {
      '/wallet': {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Clique para mais detalhes!',
              callback_data: '/partials'
            }]
          ]
        }
      }
    }

    const withOptions = ['/wallet']

    try {
      const action = Actions.getAction(command)
      const hasOptions = withOptions.includes(action)

      const actionHandler = ActionsHandler[action] || ActionsHandler.default
      const response = await actionHandler(command)

      const isAdminActions = command.chat.id === process.env.ADMIN_CHAT_ID
      !isAdminActions && await updateCommandCount(action)

      await sendCustomMessage(
        {
          text: response,
          chat_id: command.chat.id,
          message_id: command.message_id,
          ...(hasOptions && {
            options: optionsByCommand[action]
          })
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
