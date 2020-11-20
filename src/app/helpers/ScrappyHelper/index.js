const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const puppeterConfig = {
  launchConfig: { headless: true, args: ['--no-sandbox'] },
  defaultNavigationTimeOut: 0,
  defaultWaitFor: 1000
}

const launchBrowser = async ({ url }) => {
  const browser = await puppeteer.launch(puppeterConfig.launchConfig)
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(puppeterConfig.defaultNavigationTimeOut)

  await page.goto(url)
  await page.waitFor(puppeterConfig.defaultWaitFor)

  const evaluate = async (runnable) => await page.evaluate(runnable)

  return { page, browser, evaluate }
}

module.exports = { launchBrowser }
