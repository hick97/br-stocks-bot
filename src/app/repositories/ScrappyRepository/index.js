const Daily = require('../../models/Daily')

const { updateDailyData } = require('../DailyRepository')

const { launchBrowser } = require('../../helpers/ScrappyHelper')
const { createAllEarnings } = require('./helpers/dividendsHelper')

const { tryGetFundamentals } = require('./scripts/fundamentalsScript')
const { tryGetStockData, tryGetStockDataFromB3, tryGetLastStockDataUpdate, tryGetStockClass } = require('./scripts/stockScript')
const { tryGetBenchmarks } = require('./scripts/benchmarksScript')
const { tryGetDividends } = require('./scripts/dividendsScript')

const { dividendsScrappyHosts } = require('./utils/scrappyHosts')

class ScrappyRepository {
  async scrappyFundamentalsData(symbol) {
    const formattedSymbol = symbol.toLowerCase()

    const { browser, evaluate } = await launchBrowser({ url: `https://statusinvest.com.br/acoes/${formattedSymbol}` })
    const result = await evaluate(tryGetFundamentals)
    browser.close()

    return result
  }

  async scrappyDailyData(symbol) {
    console.log('Tentando ativo:' + symbol)
    let result = {}

    const formattedSymbol = symbol.toLowerCase()
    const { browser, page, evaluate } = await launchBrowser({ url: `https://statusinvest.com.br/acoes/${formattedSymbol}` })

    result = await evaluate(tryGetStockData)

    if (result.failed) {
      await page.goto(`https://statusinvest.com.br/fundos-imobiliarios/${formattedSymbol}`)
      await page.waitFor(1000)
      result = await evaluate(tryGetStockData)
    }
    // console.log(JSON.stringify(result))

    await updateDailyData(symbol, result)
    browser.close()
    return result
  }

  async scrappyBenchmarks() {
    const benchmarkSymbols = {
      IBOV: 'ibovespa',
      IFIX: 'ifix'
    }

    const ibovNavigation = await launchBrowser({ url: `https://statusinvest.com.br/indices/${benchmarkSymbols.IBOV}` })
    const ibovResult = await ibovNavigation.evaluate(tryGetBenchmarks)
    ibovNavigation.browser.close()

    // console.log(ibovResult)

    const ifixNavigation = await launchBrowser({ url: `https://statusinvest.com.br/indices/${benchmarkSymbols.IFIX}` })
    const ifixResult = await ifixNavigation.evaluate(tryGetBenchmarks)
    ifixNavigation.browser.close()

    // console.log(ifixResult)

    await updateDailyData(benchmarkSymbols.IBOV, ibovResult)
    await updateDailyData(benchmarkSymbols.IFIX, ifixResult)

    return {
      ibovResult,
      ifixResult
    }
  }

  async scrappyStockDataFromB3(symbol, isRetry = false) {
    const formattedSymbol = symbol.toUpperCase()
    console.log('Trying ' + formattedSymbol)

    const actionIdentifiers = {
      input: '#txtCampoPesquisa',
      button: '#btnBuscarOutrosAtivos'
    }

    const { browser, page, evaluate } = await launchBrowser({ url: 'http://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/cotacoes/outros-ativos.htm' })

    const delay = isRetry ? 3000 : 2000

    await page.$eval(actionIdentifiers.input, (el, value) => { el.value = value }, formattedSymbol)
    await page.click(actionIdentifiers.button)
    await page.waitFor(delay)

    const result = await evaluate(tryGetStockDataFromB3)

    await updateDailyData(symbol, result)

    browser.close()
    return result
  }

  async scrappyLastStockDataUpdate(stock) {
    const defaultSymbol = 'ITSA4'

    const symbolToScrappy = stock || defaultSymbol

    const actionIdentifiers = {
      input: '#txtCampoPesquisa',
      button: '#btnBuscarOutrosAtivos'
    }

    const { browser, page, evaluate } = await launchBrowser({ url: 'http://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/cotacoes/outros-ativos.htm' })

    await page.$eval(actionIdentifiers.input, (el, value) => { el.value = value }, symbolToScrappy)
    await page.click(actionIdentifiers.button)
    await page.waitFor(2000)

    const result = await evaluate(tryGetLastStockDataUpdate)

    browser.close()
    return result
  }

  async scrappyStockClass(symbol) {
    const quoteAlreadyExists = await Daily.findOne({ symbol: symbol.toUpperCase() })
    const classAlreadyExists = !!quoteAlreadyExists && quoteAlreadyExists.class !== 'Não aplicável'

    if (classAlreadyExists) return

    console.log('Classe do ativo:' + symbol)
    let result = {}

    const formattedSymbol = symbol.toLowerCase()
    const { browser, page, evaluate } = await launchBrowser({ url: `https://statusinvest.com.br/acoes/${formattedSymbol}` })

    result = await evaluate(tryGetStockClass)

    if (result.failed) {
      await page.goto(`https://statusinvest.com.br/fundos-imobiliarios/${formattedSymbol}`)
      await page.waitFor(1000)
      result = await evaluate(tryGetStockClass)
    }

    if (result.failed) {
      await page.goto(`https://statusinvest.com.br/bdrs/${formattedSymbol}`)
      await page.waitFor(2000)
      result = await evaluate(tryGetStockClass)
    }

    if (result.failed) {
      await page.goto(`https://statusinvest.com.br/etfs/${formattedSymbol}`)
      await page.waitFor(2000)
      result = await evaluate(tryGetStockClass)
    }

    await Daily.findByIdAndUpdate(quoteAlreadyExists._id, { class: result.class })

    browser.close()
    return result
  }

  async scrappyStockDividends() {
    // We need improve it to scrappy data for all companies
    const { browser, page, evaluate } = await launchBrowser({ url: dividendsScrappyHosts.stocks })
    await page.waitForSelector('#result')

    const stockEarnings = await evaluate(tryGetDividends)

    const { datePayment: stocksPaymentSection } = JSON.parse(stockEarnings)
    !!stockEarnings && await createAllEarnings(stocksPaymentSection)

    browser.close()
    return stocksPaymentSection
  }

  async scrappyFiisDividends() {
    // We need improve it to scrappy data for all companies
    const { browser, page, evaluate } = await launchBrowser({ url: dividendsScrappyHosts.fiis })
    await page.waitForSelector('#result')

    const fiisEarnings = await evaluate(tryGetDividends)

    const { datePayment: fiisPaymentSection } = JSON.parse(fiisEarnings)
    !!fiisEarnings && await createAllEarnings(fiisPaymentSection)

    browser.close()
    return fiisPaymentSection
  }
}

module.exports = new ScrappyRepository()
