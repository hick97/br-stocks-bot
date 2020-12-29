const { formatTextByIndicatorsType, fundamentalsCommandIsValid, getFundamentalsText } = require('./index')
const { valuationResultMock, indicatorsMock, completeFundamentalsTextMock } = require('./mocks/index')

describe('FundamentalsHelper', () => {
  it('formatTextByIndicatorsType -> should return a formatted text when indicators type is provided', async () => {
    const result = await formatTextByIndicatorsType(indicatorsMock, 'valuation')

    expect(result).toBe(valuationResultMock)
  })

  it('getFundamentalsText -> should return a formatted text with all indicators', async () => {
    const result = await getFundamentalsText(indicatorsMock, 'ITSA4')

    expect(result).toBe(completeFundamentalsTextMock)
  })

  it('fundamentalsCommandIsValid -> should return false when term not contains /fundamentals', async () => {
    const invalidCommandTerm = '/fund'

    const match = fundamentalsCommandIsValid(invalidCommandTerm)

    expect(match).toBeFalsy()
  })

  it('fundamentalsCommandIsValid -> should return true when term contains /fundamentals', async () => {
    const lowerCaseCommandTerm = '/fundamentals'
    const upperCaseCommandTerm = '/FUNDAMENTALS'
    const similarCommandTerm = '/fundamentalss'

    const lowerCaseMatch = fundamentalsCommandIsValid(lowerCaseCommandTerm)
    const upperCaseMatch = fundamentalsCommandIsValid(upperCaseCommandTerm)
    const similarMatch = fundamentalsCommandIsValid(similarCommandTerm)

    expect(lowerCaseMatch).toBeTruthy()
    expect(upperCaseMatch).toBeTruthy()
    expect(similarMatch).toBeTruthy()
  })
})
