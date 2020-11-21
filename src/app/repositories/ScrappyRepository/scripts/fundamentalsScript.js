var tryGetFundamentals = () => {
  const indicatorsIndexNotAllowed = [0, 13, 20, 25, 30]
  const isInvalidPage = document.querySelector('body .indicators') === null

  if (isInvalidPage) return null

  const labels = Array.from(document.querySelectorAll('.indicators h3'))
  const values = Array.prototype.slice.call(document.querySelectorAll('.indicators strong'))
  const filteredValues = values.filter((_, idx) => !indicatorsIndexNotAllowed.includes(idx))

  const fundamentals = labels.map((l, idx) => {
    const label = l.innerText
    const value = filteredValues[idx].innerText
    const isEmpty = value === '-' || value === '-%'

    return {
      label,
      value: isEmpty ? 'N/A' : value
    }
  })

  return fundamentals
}

module.exports = { tryGetFundamentals }
