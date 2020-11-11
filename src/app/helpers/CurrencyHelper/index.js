const parseToFixedFloat = (value, fixedValue = 2) => parseFloat(value).toFixed(fixedValue)

const isNegativeCheck = (value) => value.indexOf('-') === 0

const formatNumberWithOperator = (number) => number > 0 ? `+${number}` : number

module.exports = { parseToFixedFloat, isNegativeCheck, formatNumberWithOperator }
