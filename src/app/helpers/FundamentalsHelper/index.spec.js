const { formatTextByIndicatorsType } = require('./index')
const { valuationResultMock, indicatorsMock } = require('./mocks/index')

describe('FundamentalsHelper', () => {
  it('formatTextByIndicatorsType -> should return a formatted text when indicators type is provided', async () => {
    const result = await formatTextByIndicatorsType(indicatorsMock, 'valuation')
    expect(result).toBe(valuationResultMock)
  })
})
