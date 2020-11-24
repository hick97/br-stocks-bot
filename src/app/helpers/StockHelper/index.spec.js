const { validStockCommand } = require('./index')

describe('FundamentalsHelper', () => {
  it('validStockCommand -> should return true when term contains /del', async () => {
    const lowerCaseCommandTerm = '/del'
    const upperCaseCommandTerm = '/DEL'
    const similarCommandTerm = '/dell'

    const lowerCaseMatch = validStockCommand(lowerCaseCommandTerm)
    const upperCaseMatch = validStockCommand(upperCaseCommandTerm)
    const similarMatch = validStockCommand(similarCommandTerm)

    expect(lowerCaseMatch).toBeTruthy()
    expect(upperCaseMatch).toBeTruthy()
    expect(similarMatch).toBeTruthy()
  })

  it('validStockCommand -> should return true when term contains /stock', async () => {
    const lowerCaseCommandTerm = '/stock'
    const upperCaseCommandTerm = '/STOCK'
    const similarCommandTerm = '/stocks'

    const lowerCaseMatch = validStockCommand(lowerCaseCommandTerm)
    const upperCaseMatch = validStockCommand(upperCaseCommandTerm)
    const similarMatch = validStockCommand(similarCommandTerm)

    expect(lowerCaseMatch).toBeTruthy()
    expect(upperCaseMatch).toBeTruthy()
    expect(similarMatch).toBeTruthy()
  })
})
