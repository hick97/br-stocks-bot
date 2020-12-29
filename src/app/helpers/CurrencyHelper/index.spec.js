const
  {
    parseToFixedFloat,
    isNegativeCheck,
    formatNumberWithOperator,
    getPartialRentability,
    parseToCleanedFloat,
    getPercentualFromAmount
  } = require('./index')

describe('CurrencyHelper', () => {
  it('parseToFixedFloat -> should return the correct parsed value', async () => {
    const valueToParse = '7.383436'
    const expectedResult = '7.383'

    const result = parseToFixedFloat(valueToParse, 3)

    expect(result).toBe(expectedResult)
  })

  it('isNegativeCheck -> should check if string value is negative', async () => {
    const negativeValue = '-7.383436'
    const positiveValue = '7.383436'
    const customValue = '7.38-34-36'

    const negativeResult = isNegativeCheck(negativeValue)
    const positiveResult = isNegativeCheck(positiveValue)
    const customResult = isNegativeCheck(customValue)

    expect(negativeResult).toBeTruthy()
    expect(positiveResult).toBeFalsy()
    expect(customResult).toBeFalsy()
  })

  it('formatNumberWithOperator -> should format number with + and - operators', async () => {
    const negativeValue = '-7.38'
    const positiveValue = '7.38'

    const negativeResult = formatNumberWithOperator(negativeValue)
    const positiveResult = formatNumberWithOperator(positiveValue)

    expect(negativeResult).toBe('-7.38')
    expect(positiveResult).toBe('+7.38')
  })

  it('getPartialRentability -> should return the correct partial rentability with two decimal places', async () => {
    const initialAmount = '2000'
    const currentAmount = '3000'

    const result = getPartialRentability(initialAmount, currentAmount)
    const expectedRentability = '50.00' // percentual

    expect(result).toBe(expectedRentability)
  })

  it('parseToCleanedFloat -> should return the correct parsed value when string value is provided', async () => {
    const initialValue = '32.43%'
    const expectedParsedValue = 32.43

    const result = parseToCleanedFloat(initialValue)

    expect(result).toBe(expectedParsedValue)
  })

  it('getPercentualFromAmount -> should return the correct percentual value applied in some Amount', async () => {
    const amount = '100'
    const value = '10'
    const expectedPercentual = '10.00'

    const result = getPercentualFromAmount(amount, value)

    expect(result).toBe(expectedPercentual)
  })
})
