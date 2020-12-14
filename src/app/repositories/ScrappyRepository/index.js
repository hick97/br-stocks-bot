const Daily = require('../../models/Daily')

const { updateDailyData } = require('../DailyRepository')

const { launchBrowser } = require('../../helpers/ScrappyHelper')

const { tryGetFundamentals } = require('./scripts/fundamentalsScript')
const { tryGetStockData, tryGetStockDataFromB3, tryGetLastStockDataUpdate, tryGetStockClass } = require('./scripts/stockScript')
const { tryGetBenchmarks } = require('./scripts/benchmarksScript')

class ScrappyRepository {
  async scrappyFundamentalsData(symbol) {
    const formattedSymbol = symbol.toLowerCase()

    const { browser, evaluate } = await launchBrowser({ url: `https://statusinvest.com.br/acoes/${formattedSymbol}` })
    const result = await evaluate(tryGetFundamentals)
    browser.close()

    // console.log(result)
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

    const delay = isRetry ? 2000 : 1000

    await page.$eval(actionIdentifiers.input, (el, value) => { el.value = value }, formattedSymbol)
    await page.click(actionIdentifiers.button)
    await page.waitFor(delay)

    const result = await evaluate(tryGetStockDataFromB3)

    console.log(result)

    await updateDailyData(symbol, result)

    browser.close()
    // console.log(result)
    return result
  }

  async scrappyLastStockDataUpdate() {
    const defaultSymbol = 'ITSA4'

    const actionIdentifiers = {
      input: '#txtCampoPesquisa',
      button: '#btnBuscarOutrosAtivos'
    }

    const { browser, page, evaluate } = await launchBrowser({ url: 'http://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/cotacoes/outros-ativos.htm' })

    await page.$eval(actionIdentifiers.input, (el, value) => { el.value = value }, defaultSymbol)
    await page.click(actionIdentifiers.button)
    await page.waitFor(1000)

    const result = await evaluate(tryGetLastStockDataUpdate)

    browser.close()
    console.log(result)
    return result
  }

  async scrappyStockClass(symbol) {
    const quoteAlreadyExists = await Daily.findOne({ symbol: symbol.toUpperCase() })
    const classAlreadyExists = quoteAlreadyExists.class !== 'Não aplicável'

    console.log(quoteAlreadyExists.class)

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

    console.log(result)

    await Daily.findByIdAndUpdate(quoteAlreadyExists._id, { class: result.class })

    browser.close()
    return result
  }
}

module.exports = new ScrappyRepository()
