const { isNegativeCheck, parseToFixedFloat, getPartialRentability } = require('../CurrencyHelper')
const { getCurrentDate } = require('../DateHelper')

const { emojis } = require('../../enum/EmojiEnum')

const getStockReportText = ({ symbol, dailyResult, dailyCurrencyVariation, partialResult, partialPercentualVariation }) => {
  const isNegative = isNegativeCheck(dailyResult.change)
  const defaultEmojis = isNegative ? emojis.brokenHeart : emojis.greenHeart

  const withoutError =
    '<code>FECHAM.</code>\t\t\t<code>R$ ' + dailyResult.price + '</code>\n' +
    '<code>RENTAB.</code>\t\t\t<code>R$ ' + parseToFixedFloat(dailyCurrencyVariation) + ' (' + dailyResult.change + ')' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseToFixedFloat(partialResult) + ' (' + partialPercentualVariation + '%)' + '</code>\n\n'

  return '<b>' + symbol.toUpperCase() + '</b> ' + defaultEmojis + '\n' + withoutError
}

const getStockReportTextWhenFailed = ({ symbol }) => {
  const withError = '<code>ATIVO INVÁLIDO</code>\n\n'
  const formattedSymbol = symbol.toUpperCase()

  const text = '<b>' + formattedSymbol + '</b> ' + emojis.prohibited + '\n' + withError

  return text
}

const getCompleteReportByClass = ({ shares, type, emoji }) => {
  const reportHour = getCurrentDate() + '<code> ( 17h50 )</code>\n\n'
  const textHeader = `<b>${emojis[emoji]} ${type}</b>\n\n`

  const partialText = shares.map(item => {
    const partialRentability = getPartialRentability(item.initialAmount, item.partialResult)
    const currentTex =
      getStockReportText({
        symbol: item.stock,
        dailyResult: item.dailyResult,
        dailyCurrencyVariation: item.dailyCurrencyVariation,
        partialResult: item.partialResult,
        partialPercentualVariation: partialRentability
      })

    return currentTex
  })

  return reportHour + textHeader + partialText.join('')
}

module.exports = { getStockReportText, getStockReportTextWhenFailed, getCompleteReportByClass }
