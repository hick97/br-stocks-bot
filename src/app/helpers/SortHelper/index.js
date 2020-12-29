const dynamicSort = ({ property, order }) => {
  const sortOrder = order === 'desc' ? -1 : 1

  const sorted = (prev, current) => {
    const previousProp = parseFloat(prev[property])
    const currentProp = parseFloat(current[property])

    const shouldComeBefore = -1 * sortOrder
    const shouldComeAfter = 1 * sortOrder
    const areTheSame = 0 * sortOrder

    if (previousProp < currentProp) {
      return shouldComeBefore
    } else if (previousProp > currentProp) {
      return shouldComeAfter
    } else {
      return areTheSame
    }
  }

  return sorted
}

module.exports = { dynamicSort }
