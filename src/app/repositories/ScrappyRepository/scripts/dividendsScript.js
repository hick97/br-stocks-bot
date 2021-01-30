const tryGetDividends = () => {
  const dataScrappyFailed = document.querySelector('#result') === null

  if (dataScrappyFailed) return

  const selector = document.querySelector('#result')
  return selector.getAttribute('value')
}

module.exports = { tryGetDividends }
