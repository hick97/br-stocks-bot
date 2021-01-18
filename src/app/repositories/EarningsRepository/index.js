
const { isBefore } = require('date-fns')
const Earnings = require('../../models/Earnings')
const { getCurrentDate } = require('../../helpers/DateHelper')

class EarningsRepository {
  async listAllEarnings() {
    const stocks = await Earnings.find({})

    return stocks
  }

  async createEarning(earning) {
    const
      {
        code,
        resultAbsoluteValue,
        dateCom,
        paymentDividend,
        earningType,
        failed
      } = earning

    // check if earning already exists in db
    const earningAlreadyExists = await Earnings.findOne({
      code,
      resultAbsoluteValue,
      limitDate: dateCom,
      paymentDate: paymentDividend,
      earningType,
      failed: false
    })

    if (earningAlreadyExists) return

    await Earnings.create({
      code,
      resultAbsoluteValue,
      limitDate: dateCom,
      paymentDate: paymentDividend,
      earningType,
      failed
    })
  }

  async cleanOldEarnings() {
    const [currentDay, currentMonth, currentYear] = getCurrentDate(false).split('/')

    const earnings = await Earnings.find({}).select('paymentDate')

    const earningsToExclude = earnings.filter(e => {
      const [earningDay, earningMonth, earningYear] = e.paymentDate.split('/')

      const currentDateToCompare = new Date(`${currentYear}/${currentMonth}/${currentDay}`)
      const earningDateToCompare = new Date(`${earningYear}/${earningMonth}/${earningDay}`)

      const haveToExclude = isBefore(earningDateToCompare, currentDateToCompare)

      if (haveToExclude) return true
    }).map(e => e._id)

    await Earnings.deleteMany({
      _id: { $in: earningsToExclude }
    })
  }

  async getEarningsWithDatePaymentEqualsToday() {
    const currentDate = getCurrentDate(false)

    const earnings = await Earnings.find({
      paymentDate: currentDate
    })

    return earnings
  }
}

module.exports = new EarningsRepository()
