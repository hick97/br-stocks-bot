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

const tryGetStockClass = () => {
  const isInvalidPage = document.querySelector('body .top-info') === null
  const stockClass = isInvalidPage ? 'Não aplicável' : document.querySelectorAll('body .main-breadcrumb span')[1].innerText
  return { class: stockClass, failed: isInvalidPage }
}

const tryGetStockDataFromB3 = () => {
  const dataIdentifiers = {
    name: '#ativo',
    price: '#cotacaoAtivo',
    variation: '#oscilacaoAtivo'
  }

  const emptyData = '______'
  const unavailableData = 'Não aplicável'
  const isInvalidPage = document.querySelector(dataIdentifiers.name).innerText === emptyData

  const stock = isInvalidPage
    ? {
      price: unavailableData,
      change: unavailableData,
      failed: isInvalidPage
    } : {
      price: document.querySelector(dataIdentifiers.price).innerText,
      change: document.querySelector(dataIdentifiers.variation).innerText,
      failed: isInvalidPage
    }

  return stock
}

const tryGetLastStockDataUpdate = () => {
  const dataIdentifiers = {
    name: '#ativo',
    date: '#dataConsulta',
    hour: '#horaConsulta'
  }

  const emptyData = '______'
  const unavailableData = 'Não aplicável'
  const isInvalidPage = document.querySelector(dataIdentifiers.name).innerText === emptyData

  const data = isInvalidPage
    ? {
      date: unavailableData,
      hour: unavailableData
    } : {
      date: document.querySelector(dataIdentifiers.date).innerText,
      hour: document.querySelector(dataIdentifiers.hour).innerText
    }

  return data
}

module.exports = { tryGetStockData, tryGetStockDataFromB3, tryGetLastStockDataUpdate, tryGetStockClass }
