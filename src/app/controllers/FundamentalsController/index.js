const FundamentalsRepository = require('../../repositories/FundamentalsRepository')
const ScrappyRepository = require('../../repositories/ScrappyRepository')

const { getFundamentalsText } = require('../../helpers/FundamentalsHelper')

const { isWeekend } = require('../../helpers/DateHelper')
const { useSentryLogger } = require('../../helpers/LogHelper')
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

    const cleanedSymbol = symbol.trim().toUpperCase()
    const isFractional = cleanedSymbol.endsWith('F')
    const formattedSymbol = isFractional ? cleanedSymbol.slice(0, -1) : cleanedSymbol

    const stockClass = await ScrappyRepository.scrappyStockClass(formattedSymbol)
    if (stockClass !== 'Ações') return ErrorMessages.INVALID_STOCK_TYPE

    const fundamentals = await FundamentalsRepository.getFundamentalsByStock(formattedSymbol)
    const isInvalidStock = !fundamentals || fundamentals.length === 0

    if (isInvalidStock) {
      const errorMessage = `Error(chat_id=${chat.id}) - Não foi possível achar fundamentos para o ativo=${formattedSymbol}).`
      useSentryLogger(null, errorMessage)
      return ErrorMessages.NOT_FOUND
    }

    return await getFundamentalsText(fundamentals, symbol)
  }

  async updateFundamentals() {
    try {
      if (isWeekend()) return
      await FundamentalsRepository.updateAllFundamentals()
    } catch (err) {
      const errorMessage = 'Error (Houve uma falha ao atualizar todos os fundamentos)'
      useSentryLogger(err, errorMessage)
    }
  }
}

module.exports = new FundamentalsController()
