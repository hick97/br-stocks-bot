const dynamicSort = (property, order) => {
  var sort_order = 1
  if (order === 'desc') {
    sort_order = -1
  }
  return function (a, b) {
    // a should come before b in the sorted order
    if (parseFloat(a[property]) < parseFloat(b[property])) {
      return -1 * sort_order
      // a should come after b in the sorted order
    } else if (parseFloat(a[property]) > parseFloat(b[property])) {
      return 1 * sort_order
      // a and b are the same
    } else {
      return 0 * sort_order
    }
  }
}

module.exports = { dynamicSort }
