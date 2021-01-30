
const timer = (ms) => {
  // eslint-disable-next-line promise/param-names
  return new Promise(res => setTimeout(res, ms))
}

const retryFunction = async ({ fn, retries, timout, label = '' }) => {
  let lastError = null

  for (var i = 1; i <= retries; i++) {
    try {
      if (i !== 1) await timer(i * timout)
      return await fn()
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(
    `Function ${label} failed after retrying ${retries} times with error = ${lastError}`
  )
}

module.exports = { retryFunction }
