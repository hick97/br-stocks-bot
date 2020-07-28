const FundamentalsRepository = require('../repositories/FundamentalsRepository')
const staticMessages = require('../enum/messages')
const { useSentryLogger } = require('../helpers/exceptionHelper')

class FundamentalsController {
  async execute(message) {
    const { text, chat } = message

    const keys = text.split(' ').map(function (item) {
      return item.trim()
    })
    const values = keys.filter(element => element !== '')

    if (values.length === 1 || values.length > 2) return staticMessages.INVALID_COMMAND

    const symbol = values[1]

    const fundamentals = await FundamentalsRepository.getFundamentalsByStock(symbol)

    const isInvalidStock = !fundamentals || fundamentals.length === 0

    if (isInvalidStock) {
      useSentryLogger(null, `Error(chat_id=${chat.id}) - Não foi possível achar fundamentos para o ativo=${symbol}.`)
      return staticMessages.NOT_FOUND
    }

    const fundamentalsText = await FundamentalsRepository.getFundamentalsText(fundamentals, symbol)

    return fundamentalsText
  }

  async updateFundamentals() {
    try {
      await FundamentalsRepository.updateAllFundamentals()
    } catch (err) {
      useSentryLogger(err)
    }
  }
}

module.exports = new FundamentalsController()
