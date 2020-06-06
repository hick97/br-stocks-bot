const TELEGRAM_KEY = '1099734412:AAGpSWaNzMgLWMOpZuHjwbU0Ja2ky_FqsOo'
const ALPHA_VANTAGE_KEY = 'SLI295BQJVUNQHVL'

module.exports = {
  telegramURL: `https://api.telegram.org/bot${TELEGRAM_KEY}`,
  alphaVantageURL: `https://www.alphavantage.co/query?apikey=${ALPHA_VANTAGE_KEY}`
}
