
var tryGetFundamentals = () => {
  const indicatorsValuesNotAllowed =
    [
      'INDICADORES DE VALUATION',
      'INDICADORES DE ENDIVIDAMENTO',
      'INDICADORES DE EFICIÊNCIA',
      'INDICADORES DE RENTABILIDADE',
      'INDICADORES DE CRESCIMENTO',
      'Indicadores de Valuation',
      'Indicadores de Endividamento',
      'Indicadores de Eficiência',
      'Indicadores de Rentabilidade',
      'Indicadores de Crescimento'
    ]

  const isInvalidPage = document.querySelector('body .indicators') === null

  if (isInvalidPage) return null

  const labels = Array.from(document.querySelectorAll('.indicators h3'))
  const values = Array.from(document.querySelectorAll('.indicators strong'))
  const filteredValues = values.filter((v) => !indicatorsValuesNotAllowed.includes(v.innerText))

  const fundamentals = filteredValues.map((value, idx) => {
    const label = labels[idx].innerText
    const formattedValue = value.innerText
    const isEmpty = formattedValue === '-' || formattedValue === '-%'

    return {
      label,
      value: isEmpty ? 'N/A' : formattedValue
    }
  })

  return fundamentals
}

module.exports = { tryGetFundamentals }
