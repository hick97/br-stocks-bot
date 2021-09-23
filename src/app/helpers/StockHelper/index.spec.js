const { validStockCommand, getStockValues } = require('./index')

describe('StockHelper', () => {
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

  it('validStockCommand -> should return falsy when term contains /stock and are incomplete', async () => {
    const lowerCaseCommandTerm = '/stock'
    const upperCaseCommandTerm = '/STOCK'
    const similarCommandTerm = '/stocks'

    const lowerCaseMatch = validStockCommand(lowerCaseCommandTerm)
    const upperCaseMatch = validStockCommand(upperCaseCommandTerm)
    const similarMatch = validStockCommand(similarCommandTerm)

    expect(lowerCaseMatch).toBeFalsy()
    expect(upperCaseMatch).toBeFalsy()
    expect(similarMatch).toBeFalsy()
  })

  it('getStockValues -> should return the correct values given a /stock or /del command', async () => {
    const commandNewStock = '/stock ITSA4 15 10.48'
    const commandDeleteStock = '/del ITSA4'
    const invalidCommand = '/stock ITSA4 10.48'

    const newStockResult = getStockValues(commandNewStock)
    const deleteStockResult = getStockValues(commandDeleteStock)
    const invalidCommandResult = getStockValues(invalidCommand)

    expect(newStockResult).toStrictEqual(
      {
        actions: '/stock',
        stock: 'ITSA4',
        quantity: '15',
        price: '10.48'
      }
    )
    expect(deleteStockResult).toStrictEqual({
      actions: '/del',
      stock: 'ITSA4',
      quantity: undefined,
      price: undefined
    })
    expect(invalidCommandResult).toEqual({})
  })
})
