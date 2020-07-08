const walletTabulation = (size, type) => {
  if (type === 'stock') {
    const result = size > 5 ? '\t' : '\t\t'
    return result
  }
  if (type === 'price') {
    if (size > 5) {
      return '\t'
    }
    if (size < 5) {
      return '\t\t\t'
    }
    if (size === 5) {
      return '\t\t'
    }
  }
}

module.exports = { walletTabulation }
