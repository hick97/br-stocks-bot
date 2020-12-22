const Daily = require('../../models/Daily')
const Wallet = require('../../models/Wallet')

const DailyRepository = require('../DailyRepository')
const ScrappyRepository = require('../ScrappyRepository')

const { getCurrentDate } = require('../../helpers/DateHelper')
const { getStockReportTextWhenFailed, getCompleteReportByClass } = require('../../helpers/ReportHelper')
const { parseToCleanedFloat, formatNumberWithOperator, parseToFixedFloat, getPartialRentability } = require('../../helpers/CurrencyHelper')

class ReportRepository {
  async createDailyQuotes(stocks, isRetry = false) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index].stock
      // await ScrappyRepository.scrappyDailyData(stock)
      await ScrappyRepository.scrappyStockDataFromB3(stock, isRetry)
      await ScrappyRepository.scrappyStockClass(stock)
    }
  }

  async buildSharePerfomance(walletId, stocks, previousAmount, withPreviousAmount, hour) {
    const othersText = []
    const fiisData = []
    const stocksData = []

    let walletResult = 0

    for (let index = 0; index < stocks.length; index++) {
      const { stock: symbol, quantity, price } = stocks[index]

      // check if daily already exists
      const stockAlreadyExists = await DailyRepository.getDailyBySymbol(symbol)
      const dailyResult = !stockAlreadyExists ? await ScrappyRepository.scrappyDailyData(symbol) : stockAlreadyExists

      // check if scrappy failed
      if (dailyResult.failed) {
        const partialText = getStockReportTextWhenFailed({ symbol })
        othersText.push(partialText)
        continue
      }

      // when not failed
      const formattedPrice = parseToCleanedFloat(dailyResult.price)

      const partialResult = formattedPrice * quantity
      const initialAmount = parseToFixedFloat(price * quantity)

      walletResult += partialResult

      const symbolClass = await DailyRepository.getClassBySymbol(symbol)
      const dataToPush = { stock: symbol, dailyResult, partialResult, initialAmount }

      // push share data by class
      const isStock = symbolClass === 'Ações'
      isStock ? stocksData.push(dataToPush) : fiisData.push(dataToPush)
    }

    const formattedHour = hour !== 'Não aplicável' ? hour : ''

    // creating report text by class
    const stockText = getCompleteReportByClass({ shares: stocksData, type: 'AÇÕES', emoji: 'graphic', hour: formattedHour })
    const fiisText = getCompleteReportByClass({ shares: fiisData, type: 'FIIS', emoji: 'building', hour: formattedHour })

    // get wallet rentability
    const previousResult = withPreviousAmount && previousAmount
    const dailyPercentualResult = withPreviousAmount && getPartialRentability(previousAmount, walletResult)

    // update previous result
    await Wallet.findByIdAndUpdate(walletId, {
      previousAmount: walletResult,
      withPreviousAmount: true
    })

    const report = {
      message: {
        fiis: fiisText,
        stocks: stockText,
        others: othersText.join('')
      },
      daily_result: walletResult,
      previous_result: previousResult,
      daily_percentual_result: dailyPercentualResult,
      with_previous_amount: withPreviousAmount
    }

    return report
  }

  async buildWalletPerfomance(stocks, report, hour) {
    const {
      previous_result,
      daily_result,
      daily_percentual_result,
      with_previous_amount
    } = report

    const formattedHour = hour !== 'Não aplicável' ? '<code> ( ' + hour + ' )</code>' : ''
    const todayForTelegram = getCurrentDate() + formattedHour + '\n\n'
    const todayForWhats = '* %F0%9F%93%85 ' + getCurrentDate(false) + '*' + '\n\n'

    const ibovResult = await Daily.findOne({ symbol: 'IBOVESPA' })
    const ifixResult = await Daily.findOne({ symbol: 'IFIX' })

    const existingBenchmarks = {
      ibovResult,
      ifixResult
    }

    const { ibovResult: ibovData, ifixResult: ifixData } = !ibovResult || !ifixResult ? await ScrappyRepository.scrappyBenchmarks() : existingBenchmarks

    const errorMessage = 'Houve uma falha'
    const ibovMessage = ibovData.failed ? errorMessage : `${ibovData.change} (${ibovData.price}pts)`
    const ifixMessage = ifixData.failed ? errorMessage : `${ifixData.change} (${ifixData.price}pts)`

    const amountInvested = stocks.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0)
    const formattedPercentualResult = with_previous_amount && parseToFixedFloat(daily_percentual_result)
    const formattedRealResult = with_previous_amount && parseToFixedFloat(daily_result - previous_result)

    const dailyWalletRentability =
      with_previous_amount
        ? `${formatNumberWithOperator(formattedPercentualResult)}% (R$ ${formatNumberWithOperator(formattedRealResult)})`
        : 'Consolidando...'

    const generalWalletRentability = getPartialRentability(amountInvested, daily_result)

    const telegramText = '<b>Resumo da Carteira</b>\n\n' +
      todayForTelegram +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseToFixedFloat(amountInvested)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseToFixedFloat(daily_result)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseToFixedFloat(generalWalletRentability)}%</code>\n\n` +
      '<b>DIÁRIO</b>\n' +
      `<code>IFIX: </code> <code>${ifixMessage}</code>\n` +
      `<code>IBOV: </code> <code>${ibovMessage}</code>\n` +
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
