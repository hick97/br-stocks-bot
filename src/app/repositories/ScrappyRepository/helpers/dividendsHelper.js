const { createEarning } = require('../../EarningsRepository')

const createAllEarnings = async (paymentSection) => {
  if (!paymentSection) return

  for (let index = 0; index < paymentSection.length; index++) {
    const earning = paymentSection[index]

    /* Wee need remove it after improve */
    earning.failed = false

    await createEarning(earning)
  }
}

module.exports = { createAllEarnings }
