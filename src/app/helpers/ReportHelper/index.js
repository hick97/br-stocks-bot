const { isNegativeCheck, parseToFixedFloat, getPartialRentability } = require('../CurrencyHelper')
const { getCurrentDate } = require('../DateHelper')

const { emojis } = require('../../enum/EmojiEnum')

const getStockReportText = ({ symbol, dailyResult, partialResult, partialPercentualVariation }) => {
  const isNegative = isNegativeCheck(dailyResult.change)
  const defaultEmojis = isNegative ? emojis.brokenHeart : emojis.greenHeart

  const withoutError =
    '<code>FECHAM.</code>\t\t\t<code>R$ ' + dailyResult.price + ' (' + dailyResult.change + '%)' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseToFixedFloat(partialResult) + ' (' + partialPercentualVariation + '%)' + '</code>\n\n'

  return '<b>' + symbol.toUpperCase() + '</b> ' + defaultEmojis + '\n' + withoutError
}

const getStockReportTextWhenFailed = ({ symbol }) => {
  const withError = '<code>ATIVO INVÁLIDO</code>\n\n'
  const formattedSymbol = symbol.toUpperCase()

  const text = '<b>' + formattedSymbol + '</b> ' + emojis.prohibited + '\n' + withError

  return text
}

const getCompleteReportByClass = ({ shares, type, emoji, hour }) => {
  const reportTypeText = '<b>Resultados parciais</b>\n\n'
  const reportHour = getCurrentDate() + '<code> ( ' + hour + ' )</code>\n\n'
  const classTypeText = `<b>${emojis[emoji]} ${type}</b>\n\n`

  const partialText = shares.map(item => {
    const partialRentability = getPartialRentability(item.initialAmount, item.partialResult)
    const currentTex =
      getStockReportText({
        symbol: item.stock,
        dailyResult: item.dailyResult,
        partialResult: item.partialResult,
        partialPercentualVariation: partialRentability
      })

    return currentTex
  })

  const hasNoText = partialText.length === 0
  const validText = reportTypeText + reportHour + classTypeText + partialText.join('')

  return { text: hasNoText ? '' : validText, failed: hasNoText }
}

module.exports = { getStockReportText, getStockReportTextWhenFailed, getCompleteReportByClass }
