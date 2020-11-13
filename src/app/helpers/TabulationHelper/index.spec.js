const { fundamentalsTabulation } = require('./index')
const { fundamentalsTabulationMock } = require('./mocks/index')

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
})
