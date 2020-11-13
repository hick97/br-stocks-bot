const fundamentalsTabulation = (size) => {
  const tab = {
    6: '\t',
    5: '\t\t',
    4: '\t\t\t',
    3: '\t\t\t\t',
    2: '\t\t\t\t\t',
    1: '\t\t\t\t\t'
  }

  return tab[size] || ''
}

module.exports = { fundamentalsTabulation }
