const Daily = require('../models/Daily')

const StockRepository = require('../repositories/StockRepository')
const ScrappyRepository = require('../repositories/ScrappyRepository')

const reportHelper = require('../helpers/reportHelper')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].stock
      await ScrappyRepository.retryStockData(stock)
      console.log('DADOS DO ATIVO: ' + stock + ' ADD AO BD')
      // clearTimeout(1000 * 60)
    }
    await ScrappyRepository.getIbovData()
  }

  async buildReport(chat_id, stocks) {
    const text = ['<code>ATUALIZAÇÃO - 17h50</code>\n\n']
    let sum = 0
    let dailyChange = 0

    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index]
      let stockData = {}

      const stockAlreadyExists = await Daily.findOne({ symbol: (stock.stock).toUpperCase() })

      if (!stockAlreadyExists) {
        // console.log('NAO ACHEI O ATIVO: ' + stock.stock + ' ADD AO BD')
        stockData = await ScrappyRepository.retryStockData(stock.stock)
      } else {
        // console.log('ACHEI O ATIVO: ' + stock.stock + ' ADD AO BD')
        stockData = stockAlreadyExists
      }

      if (stockData.failed) {
        const partialText = reportHelper.getStockReportText(stock.stock, stockData)
        text.push(partialText)
        continue
      }

      const formattedPrice = parseFloat(stockData.price.replace(/,/g, '.'))

      const newChange = stockData.change.replace(/%/g, '')
      const formattedChange = parseFloat(newChange.replace(/,/g, '.'))

      const oldValue = (formattedPrice * 100) / (100 - formattedChange)
      const difference = oldValue - formattedPrice

      const partial = formattedPrice * stock.quantity

      sum += formattedPrice * stock.quantity
      dailyChange += difference * stock.quantity
      // const stockData = await StockRepository.getStockQuote(stock.stock)
      const partialText = reportHelper.getStockReportText(stock.stock, stockData, difference, partial)
      text.push(partialText)

      // console.log(`${stock.stock} - Adicionando ao Daily Change(${dailyChange}) -> ${difference} * ${stock.quantity}`)
    }

    const daily_result = sum
    const previous_result = daily_result - dailyChange
    const daily_percentual_result = dailyChange / previous_result * 100

    /*
    console.log(`Total = ${sum}`)
    console.log(`dailyChange = ${dailyChange}`)
    console.log(`previous_result = ${previous_result}`)
    console.log(`dailyPercentual = ${daily_percentual_result}`)
    */

    const report = {
      chat_id,
      message: text.join(''),
      daily_result,
      previous_result,
      daily_percentual_result
    }

    return report
  }

  async buildWalletReport(stocks, stockReport) {
    const {
      previous_result,
      daily_result,
      daily_percentual_result
    } = stockReport

    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
    var yyyy = today.getFullYear()

    today = '<b>&#x1F4C5 ' + dd + '/' + mm + '/' + yyyy + '</b>\n\n'

    let total = 0
    for (let index = 0; index < stocks.length; index++) {
      total += stocks[index].price * stocks[index].quantity
    }
    // const ibovSymbol = 'BOVA11'
    // const ibovData = await StockRepository.getStockQuote(ibovSymbol)
    let ibovData = {}
    const stockAlreadyExists = await Daily.findOne({ symbol: 'IBOVESPA' })

    if (!stockAlreadyExists) {
      console.log('NAO ACHEI O ATIVO: ' + 'IBOVESPA' + ' ADD AO BD')
      ibovData = await ScrappyRepository.getIbovData()
    } else {
      console.log('ACHEI O ATIVO: ' + 'IBOVESPA' + ' ADD AO BD')
      ibovData = stockAlreadyExists
    }

    const ibovMessage = ibovData.failed ? 'Houve uma falha' : `${ibovData.change} (${ibovData.price})`

    const text = '<b>Resumo da Carteira</b>\n\n' +
      today +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseFloat(total).toFixed(2)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseFloat(daily_result).toFixed(2)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseFloat((daily_result - total) / total * 100).toFixed(2)}%</code>\n\n` +
      '<b>DIÁRIO</b>\n' +
      `<code>CARTEIRA:</code> <code>${parseFloat(daily_percentual_result).toFixed(2)}% (R$${parseFloat(daily_result - previous_result).toFixed(2)})</code>\n` +
      `<code>IBOVESPA:</code> <code>${ibovMessage}</code>\n`
    return text
  }
}
module.exports = new ReportRepository()
