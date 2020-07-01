const getStockReportText = (symbol, stockData, difference, partial) => {
  const isPositive = stockData.change.indexOf('-') >= 0
  const getIcon = isPositive ? '&#x1F494' : '&#x1F49A'

  const withError =
    '<code>ATIVO INVÁLIDO</code>\n'

  const withoutError =
    '<code>PREÇO</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    // '<code>RENT.</code>\t\t\t<code>' + stockData.change + '</code>\n\n'
    '<code>RENT.</code>\t\t\t<code>R$ ' + parseFloat(difference).toFixed(2) + ' (' + stockData.change + ')' + '</code>\n' +
    '<code>TOTAL</code>\t\t\t<code>R$ ' + parseFloat(partial).toFixed(2) + '</code>\n\n'

  const report = stockData.failed ? withError : withoutError

  return (
    '<b>' + symbol + '</b> ' + getIcon + '\n' +
    report
  )
}

module.exports = { getStockReportText }
