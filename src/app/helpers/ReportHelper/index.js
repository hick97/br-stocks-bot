const { isNegativeCheck, parseToFixedFloat } = require('../CurrencyHelper')
const { emojis } = require('../../enum/EmojiEnum')

const getStockReportText = (symbol, stockData, dailyCurrencyVariation = 0, partialResult = 0, partialPercentualVariation = 0) => {
  const isNegative = isNegativeCheck(stockData.change)
  const defaultEmojis = isNegative ? emojis.brokenHeart : emojis.greenHeart

  const withError =
    '<code>ATIVO INVÁLIDO</code>\n\n'

  const withoutError =
    '<code>FECHAM.</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    '<code>RENTAB.</code>\t\t\t<code>R$ ' + parseToFixedFloat(dailyCurrencyVariation) + ' (' + stockData.change + ')' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseToFixedFloat(partialResult) + ' (' + partialPercentualVariation + '%)' + '</code>\n\n'

  const report = stockData.failed ? withError : withoutError
  const customIcon = stockData.failed ? emojis.prohibited : defaultEmojis

  return '<b>' + symbol.toUpperCase() + '</b> ' + customIcon + '\n' + report
}

module.exports = { getStockReportText }
