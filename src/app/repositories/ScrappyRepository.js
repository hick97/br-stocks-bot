const Daily = require('../models/Daily')

const puppeteer = require('puppeteer')

class ScrappyRepository {
  async getFundamentals(symbol) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(`https://statusinvest.com.br/acoes/${symbol.toLowerCase()}`)

    await page.waitFor(1000)
    /*
    await page.waitForFunction(
      `document.querySelector("body").innerText.includes("${symbol.toUpperCase()}")`
    )
    */

    const result = await page.evaluate(() => {
      const fundamentals = []

      const isInvalidPage = document.querySelector('body .indicators') === null

      if (!isInvalidPage) {
        const labels = document.querySelectorAll('.indicators h3')
        const values = Array.prototype.slice.call(document.querySelectorAll('.indicators strong'))

        const filteredValues = values.filter((v, idx) => ![0, 13, 20, 25, 30].includes(idx))

        for (let index = 0; index < labels.length; index++) {
          const label = labels[index].innerText
          const value = filteredValues[index].innerText

          const fundamental = {
            label,
            value: value === '-' || value === '-%' ? 'N/A' : value
          }

          fundamentals.push(fundamental)
        }
      }

      return fundamentals
    })

    // console.log(result)

    browser.close()
    return result
  }

  async retryStockData(symbol) {
    console.log('Tentando ativo:' + symbol)
    const formattedSymbol = symbol.toLowerCase()
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)

    await page.goto(`https://statusinvest.com.br/acoes/${formattedSymbol}`)
    await page.waitFor(1000)

    /*
    await page.waitForFunction(
      `document.querySelector("body").innerText.includes("${symbol}")`
    )
    */

    const result = await page.evaluate(() => {
      const isInvalidPage = document.querySelector('body .top-info') === null

      const stock = {
        price: isInvalidPage ? 'Não aplicável' : document.querySelector('body .top-info strong').innerText,
        change: isInvalidPage ? 'Não aplicável' : document.querySelector('body .top-info span b').innerText,
        class: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .main-breadcrumb span')[1].innerText,
        failed: isInvalidPage
      }

      return stock
    })

    const quoteAlreadyExists = await Daily.findOne({ symbol: symbol.toUpperCase() })

    const obj = {
      symbol: symbol.toUpperCase(),
      price: result.price,
      change: result.change,
      class: result.class,
      failed: result.failed
    }

    if (!quoteAlreadyExists) {
      await Daily.create(obj)
    } else {
      await Daily.findByIdAndUpdate(quoteAlreadyExists._id, obj)
    }

    // console.log(JSON.stringify(result))

    browser.close()
    return result
  }

  async getIbovData() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)

    await page.goto('https://statusinvest.com.br/indices/ibovespa')
    await page.waitFor(1000)
    /*
    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("IBOVESPA")'
    )
    */

    const result = await page.evaluate(() => {
      const isInvalidPage = document.querySelector('body .top-info') === null

      const stock = {
        points: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[0].innerText,
        change: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[3].innerText,
        failed: isInvalidPage
      }

      return stock
    })

    const quoteAlreadyExists = await Daily.findOne({ symbol: 'IBOVESPA' })

    const obj = {
      symbol: 'IBOVESPA',
      price: result.points,
      change: result.change,
      failed: result.failed
    }

    if (!quoteAlreadyExists) {
      await Daily.create(obj)
    } else {
      await Daily.findByIdAndUpdate(quoteAlreadyExists._id, obj)
    }

    console.log(JSON.stringify(result))

    browser.close()
    return result
  }

  async getIfixData() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)

    await page.goto('https://statusinvest.com.br/indices/ifix')
    await page.waitFor(1000)
    /*
    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("IFIX")'
    )
    */

    const result = await page.evaluate(() => {
      const isInvalidPage = document.querySelector('body .top-info') === null

      const stock = {
        points: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[0].innerText,
        change: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[3].innerText,
        failed: isInvalidPage
      }

      return stock
    })

    const quoteAlreadyExists = await Daily.findOne({ symbol: 'IFIX' })

    const obj = {
      symbol: 'IFIX',
      price: result.points,
      change: result.change,
      failed: result.failed
    }

    if (!quoteAlreadyExists) {
      await Daily.create(obj)
    } else {
      await Daily.findByIdAndUpdate(quoteAlreadyExists._id, obj)
    }

    console.log(JSON.stringify(result))

    browser.close()
    return result
  }
}

module.exports = new ScrappyRepository()
