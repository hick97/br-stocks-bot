
const getStockReportText = (symbol, stockData, difference = 0, partial = 0, partialRentability = 0) => {
  const isPositive = stockData.change.indexOf('-') >= 0
  const defaultIcons = isPositive ? '&#x1F494' : '&#x1F49A'

  const withError =
    '<code>ATIVO INVÁLIDO</code>\n\n'

  const withoutError =
    '<code>FECHAM.</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    '<code>RENTAB.</code>\t\t\t<code>R$ ' + parseFloat(difference).toFixed(2) + ' (' + stockData.change + ')' + '</code>\n' +
    '<code>PARCIAL</code>\t\t\t<code>R$ ' + parseFloat(partial).toFixed(2) + ' (' + partialRentability + '%)' + '</code>\n\n'

  const report = stockData.failed ? withError : withoutError
  const customIcon = stockData.failed ? '&#x1F6AB' : defaultIcons

  return (
    '<b>' + symbol.toUpperCase() + '</b> ' + customIcon + '\n' +
    report
  )
}

const getPartialRentability = (initialAmount, currentAmount) => parseFloat((currentAmount - initialAmount) / initialAmount * 100).toFixed(2)

const getCurrentDate = ({ withHTML = true }) => {
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  var yyyy = today.getFullYear()

  const currentDate = dd + '/' + mm + '/' + yyyy

  today = withHTML ? ('<b>&#x1F4C5 ' + currentDate + '</b>') : currentDate

  return today
}

const formatNumberWithOperator = (number) => number > 0 ? '+' : ''

module.exports = { getStockReportText, getPartialRentability, getCurrentDate, formatNumberWithOperator }
