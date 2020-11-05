const Daily = require('../models/Daily')

const ScrappyRepository = require('../repositories/ScrappyRepository')
const DailyRepository = require('../repositories/DailyRepository')

const reportHelper = require('../helpers/ReportHelper')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].stock
      await ScrappyRepository.retryStockData(stock)
      console.log('DADOS DO ATIVO: ' + stock + ' ADD AO BD')
    }

    await ScrappyRepository.getIbovData()
    await ScrappyRepository.getIfixData()
  }

  async buildReport(chat_id, stocks) {
    const currentDate = reportHelper.getCurrentDate({ withHTML: true }) + '<code> ( 17h50 )</code>\n\n'

    const stockText = [currentDate]
    const fiisText = [currentDate]
    const othersText = []

    const fiisData = []
    const stocksData = []

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
        othersText.push(partialText)
        continue
      }

      const formattedPrice = parseFloat(stockData.price.replace(/,/g, '.'))

      const newChange = stockData.change.replace(/%/g, '')
      const formattedChange = parseFloat(newChange.replace(/,/g, '.'))

      const oldValue = (formattedPrice * 100) / (100 - formattedChange)
      const difference = oldValue - formattedPrice

      const partial = formattedPrice * stock.quantity
      const initialAmount = parseFloat(stock.price * stock.quantity)

      sum += formattedPrice * stock.quantity
      dailyChange += difference * stock.quantity

      const symbolClass = await DailyRepository.getClassBySymbol(stock.stock)
      const dataToPush = { stock: stock.stock, stockData, difference, partial, initialAmount }

      symbolClass === 'Ações' ? stocksData.push(dataToPush) : fiisData.push(dataToPush)

      // console.log(`${stock.stock} - Adicionando ao Daily Change(${dailyChange}) -> ${difference} * ${stock.quantity}`)
    }
    stockText.push('<b>&#x1F4CA AÇÕES</b>\n\n')
    for (let index = 0; index < stocksData.length; index++) {
      const d = stocksData[index]

      const partialRentability = reportHelper.getPartialRentability(d.initialAmount, d.partial)
      const partialText = reportHelper.getStockReportText(d.stock, d.stockData, d.difference, d.partial, partialRentability)

      stockText.push(partialText)
    }

    fiisText.push('<b>&#x1F3E2 FIIS</b>\n\n')
    for (let index = 0; index < fiisData.length; index++) {
      const d = fiisData[index]

      const partialRentability = reportHelper.getPartialRentability(d.initialAmount, d.partial)
      const partialText = reportHelper.getStockReportText(d.stock, d.stockData, d.difference, d.partial, partialRentability)

      fiisText.push(partialText)
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
      message: {
        fiis: fiisText.join(''),
        stocks: stockText.join(''),
        others: othersText.join('')
      },
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

    const todayForTelegram = '<b>&#x1F4C5 ' + dd + '/' + mm + '/' + yyyy + '</b>\n\n'
    const todayForWhats = '* %F0%9F%93%85 ' + dd + '/' + mm + '/' + yyyy + '*' + '\n\n'

    let total = 0
    for (let index = 0; index < stocks.length; index++) {
      total += stocks[index].price * stocks[index].quantity
    }

    let ibovData = {}
    let ifixData = {}
    const ibovAlreadyExists = await Daily.findOne({ symbol: 'IBOVESPA' })
    const ifixAlreadyExists = await Daily.findOne({ symbol: 'IFIX' })

    if (!ibovAlreadyExists) {
      console.log('NAO ACHEI O ATIVO: ' + 'IBOVESPA' + ' ADD AO BD')
      ibovData = await ScrappyRepository.getIbovData()
    } else {
      console.log('ACHEI O ATIVO: ' + 'IBOVESPA' + ' ADD AO BD')
      ibovData = ibovAlreadyExists
    }

    if (!ifixAlreadyExists) {
      console.log('NAO ACHEI O ATIVO: ' + 'IFIX' + ' ADD AO BD')
      ifixData = await ScrappyRepository.getIbovData()
    } else {
      console.log('ACHEI O ATIVO: ' + 'IFIX' + ' ADD AO BD')
      ifixData = ifixAlreadyExists
    }

    const ibovMessage = ibovData.failed ? 'Houve uma falha' : `${ibovData.change} (${ibovData.price}pts)`
    const ifixMessage = ifixData.failed ? 'Houve uma falha' : `${ifixData.change} (${ifixData.price}pts)`

    const formattedPercentualResult = parseFloat(daily_percentual_result).toFixed(2)
    const formattedRealResult = parseFloat(daily_result - previous_result).toFixed(2)

    const walletRentability = `${reportHelper.formatNumberWithOperator(formattedPercentualResult)}${formattedPercentualResult}% (R$ ${reportHelper.formatNumberWithOperator(formattedRealResult)}${formattedRealResult})`

    const telegramText = '<b>Resumo da Carteira</b>\n\n' +
      todayForTelegram +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseFloat(total).toFixed(2)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseFloat(daily_result).toFixed(2)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseFloat((daily_result - total) / total * 100).toFixed(2)}%</code>\n\n` +
      '<b>DIÁRIO</b>\n' +
      `<code>IFIX: \t\t\t</code> <code>${ifixMessage}</code>\n` +
      `<code>IBOVESPA:</code> <code>${ibovMessage}</code>\n` +
      `<code>CARTEIRA:</code> <code>${walletRentability}</code>\n`

    const whatsappText = '*Resumo da Carteira*\n\n' +
      todayForWhats +
      '*GERAL*\n' +
      `INVEST.:\t R$ ${parseFloat(total).toFixed(2)}\n` +
      `RETORNO:\t R$ ${parseFloat(daily_result).toFixed(2)}\n` +
      `RENTAB.:\t ${parseFloat((daily_result - total) / total * 100).toFixed(2)} %25 \n\n` +
      '*DIÁRIO*\n' +
      `IFIX: ${ifixMessage.replace('%', '%25')}\n` +
      `IBOVESPA: ${ibovMessage.replace('%', '%25')}\n` +
      `CARTEIRA: ${walletRentability.replace('%', '%25')}\n\n` +
      '*@brstocksbot* (Instagram)\n' +
      'https://t.me/brstocksbot'

    return { telegramText, whatsappText }
  }
}
module.exports = new ReportRepository()
