const getStockReportText = (symbol, stockData) => {
  const rentability = parseFloat(stockData.change).toFixed(2)
  const getIcon = rentability >= 0 ? '&#x1F49A' : '&#x1F494'
  return (
    '<b>' + symbol + '</b> ' + getIcon + '\n' +
    '<code>VOL.</code>\t\t\t\t\t<code>' + stockData.volume + '</code>\n' +
    // '<code>MÁX.</code>\t\t\t\t\t<code>R$ ' + stockData.high + '</code>\n' +
    // '<code>MÍN.</code>\t\t\t\t\t<code>R$ ' + stockData.low + '</code>\n' +
    '<code>PREÇO</code>\t\t\t<code>R$ ' + stockData.price + '</code>\n' +
    '<code>RENT.</code>\t\t\t<code>R$ ' + stockData.change + ' (' + stockData.changePercent + ')' + '</code>\n\n'
  )
}

module.exports = { getStockReportText }
