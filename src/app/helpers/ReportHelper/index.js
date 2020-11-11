const { isNegativeCheck, parseToFixedFloat } = require('../CurrencyHelper')
const { emojis } = require('../../enum/EmojiEnum')

const getPartialRentability = (initialAmount = 0, currentAmount = 0) => parseToFixedFloat((currentAmount - initialAmount) / initialAmount * 100)

const getStockReportText = (symbol, stockData, difference = 0, partial = 0, partialRentability = 0) => {
  const isPositive = !isNegativeCheck(stockData.change)
  const defaultEmojis = isPositive ? emojis.greenHeart : emojis.brokenHeart

  const withError =
    '<code>ATIVO INVÁLIDO</code>\n\n'

  const withoutError =
    '<code>FECHAM.</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    '<code>RENTAB.</code>\t\t\t<code>R$ ' + parseToFixedFloat(difference) + ' (' + stockData.change + ')' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseToFixedFloat(partial) + ' (' + partialRentability + '%)' + '</code>\n\n'

  const report = stockData.failed ? withError : withoutError
  const customIcon = stockData.failed ? emojis.prohibited : defaultEmojis

  return '<b>' + symbol.toUpperCase() + '</b> ' + customIcon + '\n' + report
}

const getCurrentDate = (withHTML = true) => {
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  var yyyy = today.getFullYear()

  const currentDate = dd + '/' + mm + '/' + yyyy

  return withHTML ? ('<b>' + emojis.calendar + ' ' + currentDate + '</b>') : currentDate
}

const shareByWhatsapp = (text) => ({
  inline_keyboard: [
    [{
      text: 'Compartilhar - Whatsapp',
      url: `https://api.whatsapp.com/send?text=${text}`
    }]
  ]
})

module.exports = { getStockReportText, getPartialRentability, getCurrentDate, shareByWhatsapp }
