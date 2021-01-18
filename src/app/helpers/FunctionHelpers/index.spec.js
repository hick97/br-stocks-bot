
const { retryFunction } = require('./index')

describe('FunctionHelper', () => {
  const mockFnWithError = jest.fn(() => Promise.reject(new Error()))
  const mockFnWithoutError = jest.fn()

  const params = {
    label: 'testFunction',
    retries: 3,
    timout: 0
  }

  it('retryFunction -> should call the function with error 3 times and return an error', async () => {
    const functionCall = retryFunction({
      fn: mockFnWithError,
      ...params
    })

    await expect(functionCall).rejects.toThrowError(
      `Function ${params.label} failed after retrying ${params.retries} times`
    )

    expect(mockFnWithError).toBeCalledTimes(params.retries)
  })

  it('retryFunction -> should retry the function without error only once', async () => {
    await retryFunction({
      fn: mockFnWithoutError,
      ...params
    })

    expect(mockFnWithoutError).toBeCalledTimes(1)
  })
})
