const { parseToFixedFloat } = require('../../CurrencyHelper')

const successfullStockData = {
  price: '10.34',
  change: '0.80%',
  failed: false
}

const symbol = 'itsa4'
const partialResult = '300.23'
const dailyCurrencyVariation = '0.20'
const partialPercentualVariation = '33.25'

const messages = {
  withError: '<code>ATIVO INVÁLIDO</code>\n\n',
  withoutError: '<code>FECHAM.</code>\t\t\t<code>R$ ' + successfullStockData.price + ' (' + successfullStockData.change + ')' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseToFixedFloat(partialResult) + ' (' + partialPercentualVariation + '%)' + '</code>\n\n'
}

module.exports = {
  symbol,
  messages,
  partialResult,
  successfullStockData,
  dailyCurrencyVariation,
  partialPercentualVariation
}
