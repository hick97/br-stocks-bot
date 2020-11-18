const parseToFixedFloat = (value, fixedValue = 2) => parseFloat(value).toFixed(fixedValue)

const isNegativeCheck = (value) => value.indexOf('-') === 0

const formatNumberWithOperator = (number) => number > 0 ? `+${number}` : number

const getPartialRentability = (initialAmount = 0, currentAmount = 0) => parseToFixedFloat((currentAmount - initialAmount) / initialAmount * 100)

const getPercentualFromAmount = (amount = 0, value = 0) => parseToFixedFloat(value / amount * 100)

const parseToCleanedFloat = (value) => {
  const valueWithDots = value.replace(/,/g, '.')
  const valueWithoutPercentage = valueWithDots.replace(/%/g, '')
  const formattedFloatValue = parseFloat(valueWithoutPercentage)

  return formattedFloatValue
}

module.exports = { parseToFixedFloat, isNegativeCheck, formatNumberWithOperator, getPartialRentability, parseToCleanedFloat, getPercentualFromAmount }
