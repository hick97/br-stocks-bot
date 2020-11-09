const FundamentalsRepository = require('../../repositories/FundamentalsRepository')

const { useSentryLogger } = require('../../helpers/exceptionHelper')
const { splitCommand } = require('../../helpers/CommandHelper')

const { ErrorMessages } = require('../../enum/MessagesEnum')

class FundamentalsController {
  async execute(message) {
    const { text, chat } = message

    const values = splitCommand(text)

    const numberOfParams = 2
    const isValid = values.length === numberOfParams
    if (!isValid) return ErrorMessages.INVALID_COMMAND

    const symbol = values[1]
    const fundamentals = await FundamentalsRepository.getFundamentalsByStock(symbol)
    const isInvalidStock = !fundamentals || fundamentals.length === 0

    if (isInvalidStock) {
      const errorMessage = `Error(chat_id=${chat.id}) - Não foi possível achar fundamentos para o ativo=${symbol}).`
      useSentryLogger(null, errorMessage)
      return ErrorMessages.NOT_FOUND
    }

    return await FundamentalsRepository.getFundamentalsText(fundamentals, symbol)
  }

  async updateFundamentals() {
    try {
      await FundamentalsRepository.updateAllFundamentals()
    } catch (err) {
      const errorMessage = 'Error (Houve uma falha ao atualizar todos os fundamentos)'
      useSentryLogger(err, errorMessage)
    }
  }
}

module.exports = new FundamentalsController()
