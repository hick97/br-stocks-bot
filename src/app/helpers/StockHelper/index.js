const validStockCommand = (term) => {
  const regex = /\/stock|\/del/i
  const match = term.search(regex)

  const matched = match !== -1

  return matched
}

module.exports = { validStockCommand }
