const { splitCommand } = require('../CommandHelper')

const validStockCommand = (term) => {
  const regex = /\/stock|\/del/i
  const match = term.search(regex)

  const matched = match !== -1

  if (term.toLowerCase().includes('/stock')) {
    const wordsCount = term.split(' ').filter(word => !!word).length

    if (wordsCount < 4) return false
  }

  return matched
}

const getStockValues = (text) => {
  const allowedPropsLength = [2, 4]
  const values = splitCommand(text)
  const hasCorrectLength = allowedPropsLength.includes(values.length)

  const empty = {}
  if (!hasCorrectLength) return empty

  const [actions, stock, quantity, price] = values

  return {
    actions,
    stock,
    quantity,
    price
  }
}

module.exports = { validStockCommand, getStockValues }
