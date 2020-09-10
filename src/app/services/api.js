require('dotenv').config()

module.exports = {
  telegramURL: `https://api.telegram.org/bot${process.env.TELEGRAM_KEY}`,
  alphaVantageURL: `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_VANTAGE_KEY}`
}
