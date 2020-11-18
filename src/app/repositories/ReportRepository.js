const Daily = require('../models/Daily')

const DailyRepository = require('./DailyRepository')
const ScrappyRepository = require('../repositories/ScrappyRepository')

const { getCurrentDate } = require('../helpers/DateHelper')
const { getStockReportTextWhenFailed, getCompleteReportByClass } = require('../helpers/ReportHelper')
const { parseToCleanedFloat, formatNumberWithOperator, parseToFixedFloat, getPercentualFromAmount } = require('../helpers/CurrencyHelper')

const { emojis } = require('../enum/EmojiEnum')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].stock
      await ScrappyRepository.retryStockData(stock)
    }
  }

  async buildReport(stocks) {
    const othersText = []
    const fiisData = []
    const stocksData = []

    let walletResult = 0
    let walletVariation = 0

    for (let index = 0; index < stocks.length; index++) {
      const { stock: symbol, quantity, price } = stocks[index]

      // check if daily already exists
      const stockAlreadyExists = await DailyRepository.getDailyBySymbol(symbol)
      const dailyResult = !stockAlreadyExists ? await ScrappyRepository.retryStockData(symbol) : stockAlreadyExists

      // check if scrappy failed
      if (dailyResult.failed) {
        const partialText = getStockReportTextWhenFailed({ symbol })
        othersText.push(partialText)
        continue
      }

      // when not failed
      const formattedPrice = parseToCleanedFloat(dailyResult.price)
      const formmatedLastPrice = parseToCleanedFloat(dailyResult.last)
      const dailyCurrencyVariation = formattedPrice - formmatedLastPrice

      const partialResult = formattedPrice * quantity
      const initialAmount = parseToFixedFloat(price * quantity)

      walletResult += partialResult
      walletVariation += dailyCurrencyVariation * quantity

      const symbolClass = await DailyRepository.getClassBySymbol(symbol)
      const dataToPush = { stock: symbol, dailyResult, dailyCurrencyVariation, partialResult, initialAmount }

      // push share data by class
      const isStock = symbolClass === 'Ações'
      isStock ? stocksData.push(dataToPush) : fiisData.push(dataToPush)
    }

    // creating report text by class
    const stockText = getCompleteReportByClass({ shares: stocksData, type: 'AÇÕES', emoji: 'graphic' })
    const fiisText = getCompleteReportByClass({ shares: fiisData, type: 'FIIS', emoji: 'building' })

    // get wallet rentability
    const previousResult = walletResult - walletVariation
    const dailyPercentualResult = getPercentualFromAmount(previousResult, walletVariation)

    const report = {
      message: {
        fiis: fiisText,
        stocks: stockText,
        others: othersText.join('')
      },
      daily_result: walletResult,
      previous_result: previousResult,
      daily_percentual_result: dailyPercentualResult
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

    const walletRentability = `${formatNumberWithOperator(formattedPercentualResult)}% (R$ ${formatNumberWithOperator(formattedRealResult)})`

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
      '*@botdoinvestidor* (Instagram)\n' +
      'https://t.me/brstocksbot'

    return { telegramText, whatsappText }
  }
}
module.exports = new ReportRepository()
