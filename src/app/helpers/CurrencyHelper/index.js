const parseToFixedFloat = (value, fixedValue = 2) => parseFloat(value).toFixed(fixedValue)

const isNegativeCheck = (value) => value.indexOf('-') === 0

const formatNumberWithOperator = (number) => number > 0 ? `+${number}` : number

const getPartialRentability = (initialAmount = 0, currentAmount = 0) => parseToFixedFloat((currentAmount - initialAmount) / initialAmount * 100)

module.exports = { parseToFixedFloat, isNegativeCheck, formatNumberWithOperator, getPartialRentability }
