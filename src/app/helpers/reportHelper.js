const getStockReportText = (symbol, stockData, difference = 0, partial = 0) => {
  const isPositive = stockData.change.indexOf('-') >= 0
  const defaultIcons = isPositive ? '&#x1F494' : '&#x1F49A'

  const withError =
    '<code>ATIVO INVÁLIDO</code>\n\n'

  const withoutError =
    '<code>PREÇO</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    // '<code>RENT.</code>\t\t\t<code>' + stockData.change + '</code>\n\n'
    '<code>RENT.</code>\t\t\t<code>R$ ' + parseFloat(difference).toFixed(2) + ' (' + stockData.change + ')' + '</code>\n' +
    '<code>TOTAL</code>\t\t\t<code>R$ ' + parseFloat(partial).toFixed(2) + '</code>\n\n'

  const report = stockData.failed ? withError : withoutError
  const customIcon = stockData.failed ? '&#x1F6AB' : defaultIcons

  return (
    '<b>' + symbol.toUpperCase() + '</b> ' + customIcon + '\n' +
    report
  )
}

module.exports = { getStockReportText }
