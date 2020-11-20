const tryGetStockData = () => {
  const isInvalidPage = document.querySelector('body .top-info') === null

  const stock = {
    price: isInvalidPage ? 'Não aplicável' : document.querySelector('body .top-info strong').innerText,
    change: isInvalidPage ? 'Não aplicável' : document.querySelector('body .top-info span b').innerText,
    class: isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .main-breadcrumb span')[1].innerText,
    failed: isInvalidPage
  }

  return stock
}

module.exports = { tryGetStockData }
