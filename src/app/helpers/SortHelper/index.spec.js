const { randomStocks, sortedStocks } = require('./mocks/index')

const { dynamicSort } = require('./index')

describe('SortHelper', () => {
  it('dynamicSort -> should sort stocks by price in descending order', async () => {
    const params = { property: 'price', order: 'desc' }

    const result = randomStocks.sort(dynamicSort(params))

    expect(result).toStrictEqual(sortedStocks[params.order])
  })

  it('dynamicSort -> should sort stocks by price in ascending order', async () => {
    const params = { property: 'price', order: 'asc' }

    const result = randomStocks.sort(dynamicSort(params))

    expect(result).toStrictEqual(sortedStocks[params.order])
  })
})
