const { updateDailyData } = require('../DailyRepository')

const { launchBrowser } = require('../../helpers/ScrappyHelper')
const { tryGetFundamentals } = require('./scripts/fundamentalsScript')
const { tryGetStockData } = require('./scripts/stockScript')
const { tryGetBenchmarks } = require('./scripts/benchmarksScript')

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
}

module.exports = new ScrappyRepository()
