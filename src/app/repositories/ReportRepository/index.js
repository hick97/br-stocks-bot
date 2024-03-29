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

  async buildSharePerfomance(stocks, hour) {
    const invalidText = []
    const fiisData = []
    const stocksData = []
    const othersData = []

    let walletResult = 0

    for (let index = 0; index < stocks.length; index++) {
      const { stock: symbol, quantity, price } = stocks[index]

      // check if daily already exists
      const stockAlreadyExists = await DailyRepository.getDailyBySymbol(symbol)
      const dailyResult = !stockAlreadyExists ? await ScrappyRepository.scrappyStockDataFromB3(symbol) : stockAlreadyExists

      // check if scrappy failed
      if (dailyResult.failed) {
        const partialText = getStockReportTextWhenFailed({ symbol })
        invalidText.push(partialText)
        continue
      }

      // when not failed
      const formattedPrice = parseToCleanedFloat(dailyResult.price)

      const partialResult = formattedPrice * quantity
      const initialAmount = parseToFixedFloat(price * quantity)

      walletResult += partialResult

      const symbolClass = await DailyRepository.getClassBySymbol(symbol)
      const dataToPush = { stock: symbol, dailyResult, partialResult, initialAmount }

      const dataByClass = {
        Ações: stocksData,
        'Fundos Imobiliários': fiisData,
        ETFs: othersData,
        BDRs: othersData
      }

      // push share data by class
      const dataSetToPush = dataByClass[symbolClass] || stocksData
      dataSetToPush.push(dataToPush)
    }

    const formattedHour = hour !== 'Não aplicável' ? hour : ''

    // creating report text by class
    const stockText = getCompleteReportByClass({ shares: stocksData, type: 'AÇÕES', emoji: 'graphic', hour: formattedHour })
    const fiisText = getCompleteReportByClass({ shares: fiisData, type: 'FIIS', emoji: 'building', hour: formattedHour })
    const othersText = getCompleteReportByClass({ shares: othersData, type: 'OUTROS', emoji: 'moneyBag', hour: formattedHour })

    const report = {
      message: {
        fiis: fiisText,
        stocks: stockText,
        others: othersText,
        invalids: invalidText.join('')
      },
      daily_result: walletResult
    }

    return report
  }

  async buildWalletPerfomance(walletId, stocks, report, previousData, hour) {
    const {
      daily_result
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

    // general data
    const amountInvested = stocks.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0)
    const generalWalletRentability = getPartialRentability(amountInvested, daily_result)
    const generalCashResult = parseToFixedFloat(daily_result - amountInvested)

    // daily data
    const formattedPercentualResult = previousData.withPreviousData && parseToFixedFloat(generalWalletRentability - previousData.percentualResult)
    const formattedRealResult = previousData.withPreviousData && parseToFixedFloat(generalCashResult - previousData.cashResult)

    // update previous result
    await Wallet.findByIdAndUpdate(walletId, {
      previousData: {
        investedAmount: parseToFixedFloat(daily_result),
        cashResult: generalCashResult,
        percentualResult: generalWalletRentability,
        withPreviousData: true
      }
    })

    const dailyWalletRentability =
      previousData.withPreviousData
        ? `${formatNumberWithOperator(formattedPercentualResult)}% (R$ ${formatNumberWithOperator(formattedRealResult)})`
        : 'Consolidando...'

    const telegramText = '<b>Resumo da Carteira</b>\n\n' +
      todayForTelegram +
      '<b>GERAL</b>\n' +
      `<code>INVEST.:\t</code> <code>R$ ${parseToFixedFloat(amountInvested)}</code>\n` +
      `<code>RETORNO:\t</code> <code>R$ ${parseToFixedFloat(daily_result)}</code>\n` +
      `<code>RENTAB.:\t</code> <code>${parseToFixedFloat(generalWalletRentability)}% (R$ ${formatNumberWithOperator(generalCashResult)})</code>\n\n` +
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
