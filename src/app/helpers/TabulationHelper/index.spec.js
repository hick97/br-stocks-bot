const { fundamentalsTabulation, walletTabulation } = require('./index')
const { fundamentalsTabulationMock, walletTabulationMock } = require('./mocks/index')

describe('TabulationHelper', () => {
  it('fundamentalsTabulation -> should return the correct tabulation by string length', async () => {
    const empty = ''
    const resultWithLengthSeven = fundamentalsTabulation(7)
    const resultWithLengthSix = fundamentalsTabulation(6)
    const resultWithLengthFive = fundamentalsTabulation(5)
    const resultWithLengthFour = fundamentalsTabulation(4)
    const resultWithLengthThree = fundamentalsTabulation(3)
    const resultWithLengthTwo = fundamentalsTabulation(2)
    const resultWithLengthOne = fundamentalsTabulation(1)

    expect(resultWithLengthSeven).toBe(empty)

    expect(resultWithLengthSix).toBe(fundamentalsTabulationMock[6])
    expect(resultWithLengthFive).toBe(fundamentalsTabulationMock[5])
    expect(resultWithLengthFour).toBe(fundamentalsTabulationMock[4])
    expect(resultWithLengthThree).toBe(fundamentalsTabulationMock[3])
    expect(resultWithLengthTwo).toBe(fundamentalsTabulationMock[2])
    expect(resultWithLengthOne).toBe(fundamentalsTabulationMock[1])
  })

  it('walletTabulation -> should return the correct tabulation by string length', async () => {
    const empty = ''
    const resultWithLengthSeven = walletTabulation(7)
    const resultWithLengthSix = walletTabulation(6)
    const resultWithLengthFive = walletTabulation(5)
    const resultWithLengthFour = walletTabulation(4)
    const resultWithLengthThree = walletTabulation(3)
    const resultWithLengthTwo = walletTabulation(2)
    const resultWithLengthOne = walletTabulation(1)

    expect(resultWithLengthSeven).toBe(empty)

    expect(resultWithLengthSix).toBe(walletTabulationMock[6])
    expect(resultWithLengthFive).toBe(walletTabulationMock[5])
    expect(resultWithLengthFour).toBe(walletTabulationMock[4])
    expect(resultWithLengthThree).toBe(walletTabulationMock[3])
    expect(resultWithLengthTwo).toBe(walletTabulationMock[2])
    expect(resultWithLengthOne).toBe(walletTabulationMock[1])
  })
})
