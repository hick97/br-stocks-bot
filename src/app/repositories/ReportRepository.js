const Daily = require('../models/Daily')

const DailyRepository = require('./DailyRepository')
const ScrappyRepository = require('../repositories/ScrappyRepository')

const { getCurrentDate } = require('../helpers/DateHelper')
const { getStockReportTextWhenFailed, getCompleteReportByClass } = require('../helpers/ReportHelper')
const { parseToCleanedFloat, formatNumberWithOperator, parseToFixedFloat, getPercentualFromAmount, getPartialRentability } = require('../helpers/CurrencyHelper')

class ReportRepository {
  async createDailyQuotes(stocks) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].stock
      await ScrappyRepository.retryStockData(stock)
    }
  }

  async buildSharePerfomance(stocks) {
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

  async buildWalletPerfomance(stocks, report) {
    const {
      previous_result,
      daily_result,
      daily_percentual_result
    } = report

    const todayForTelegram = getCurrentDate() + '\n\n'
    const todayForWhats = '* %F0%9F%93%85 ' + getCurrentDate(false) + '*' + '\n\n'

    const ibovAlreadyExists = await Daily.findOne({ symbol: 'IBOVESPA' })
    const ifixAlreadyExists = await Daily.findOne({ symbol: 'IFIX' })

    const ibovData = !ibovAlreadyExists ? await ScrappyRepository.getIbovData() : ibovAlreadyExists
    const ifixData = !ifixAlreadyExists ? await ScrappyRepository.getIfixData() : ifixAlreadyExists

    const errorMessage = 'Houve uma falha'
    const ibovMessage = ibovData.failed ? errorMessage : `${ibovData.change} (${ibovData.price}pts)`
    const ifixMessage = ifixData.failed ? errorMessage : `${ifixData.change} (${ifixData.price}pts)`

    const amountInvested = stocks.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0)
    const formattedPercentualResult = parseToFixedFloat(daily_percentual_result)
    const formattedRealResult = parseToFixedFloat(daily_result - previous_result)

    const dailyWalletRentability = `${formatNumberWithOperator(formattedPercentualResult)}% (R$ ${formatNumberWithOperator(formattedRealResult)})`
    const generalWalletRentability = getPartialRentability(amountInvested, daily_result)

    const telegramText = '<b>Resumo da Carteira</b>\n\n' +
      todayForTelegram +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseToFixedFloat(amountInvested)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseToFixedFloat(daily_result)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseToFixedFloat(generalWalletRentability)}%</code>\n\n` +
      '<b>DIÁRIO</b>\n' +
      `<code>IFIX: \t\t\t</code> <code>${ifixMessage}</code>\n` +
      `<code>IBOVESPA:</code> <code>${ibovMessage}%</code>\n` +
      `<code>CARTEIRA:</code> <code>${dailyWalletRentability}</code>\n`

    const whatsappText = '*Resumo da Carteira*\n\n' +
      todayForWhats +
      '*GERAL*\n' +
      `INVEST.:\t R$ ${parseToFixedFloat(amountInvested)}\n` +
      `RETORNO:\t R$ ${parseToFixedFloat(daily_result)}\n` +
      `RENTAB.:\t ${parseToFixedFloat(generalWalletRentability)} %25 \n\n` +
      '*DIÁRIO*\n' +
      `IFIX: ${ifixMessage.replace('%', '%25')}\n` +
      `IBOVESPA: ${ibovMessage.replace('%', '%25')}\n` +
      `CARTEIRA: ${dailyWalletRentability.replace('%', '%25')}\n\n` +
      '*@botdoinvestidor* (Instagram)\n' +
      'https://t.me/brstocksbot'

    return { telegramText, whatsappText }
  }
}
module.exports = new ReportRepository()
