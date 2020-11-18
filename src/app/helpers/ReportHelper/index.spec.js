const { getStockReportText, getStockReportTextWhenFailed } = require('./index')

const { emojis } = require('../../enum/EmojiEnum')

const {
  symbol,
  messages,
  partialResult,
  successfullStockData,
  dailyCurrencyVariation,
  partialPercentualVariation
} = require('./mocks')

describe('ReportHelper', () => {
  it('getStockReportText -> should return the correct report text when stock data is provided', async () => {
    const result =
      getStockReportText(
        {
          symbol,
          partialResult,
          dailyCurrencyVariation,
          partialPercentualVariation,
          dailyResult: successfullStockData

        })

    const expectedResult = '<b>' + symbol.toUpperCase() + '</b> ' + emojis.greenHeart + '\n' + messages.withoutError

    expect(result).toBe(expectedResult)
  })

  it('getStockReportTextWhenFailed -> should return the correct report text when stock data is failed', async () => {
    const result = getStockReportTextWhenFailed({ symbol })
    const expectedResult = '<b>' + symbol.toUpperCase() + '</b> ' + emojis.prohibited + '\n' + messages.withError

    expect(result).toBe(expectedResult)
  })
})
