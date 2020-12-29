const tryGetBenchmarks = () => {
  const isInvalidPage = document.querySelector('body .top-info') === null

  const stock = {
    points: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[0].innerText,
    change: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .top-info strong')[3].innerText,
    failed: isInvalidPage
  }

  return stock
}

module.exports = { tryGetBenchmarks }
