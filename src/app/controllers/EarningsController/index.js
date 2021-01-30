const {
  scrappyStockDividends,
  scrappyFiisDividends
} = require('../../repositories/ScrappyRepository')

const {
  cleanOldEarnings
} = require('../../repositories/EarningsRepository')

const {
  sendDividendsNotification
} = require('../../repositories/NotificationRepository')

const { useSentryLogger } = require('../../helpers/LogHelper')
const { retryFunction } = require('../../helpers/FunctionHelpers')

class EarningsController {
  async execute() {
    try {
      await retryFunction({
        fn: scrappyStockDividends,
        retries: 3,
        timout: 1000,
        label: 'scrappyStockDividends'
      })

      await retryFunction({
        fn: scrappyFiisDividends,
        retries: 3,
        timout: 1000,
        label: 'scrappyFiisDividends'
      })

      await cleanOldEarnings()
      await sendDividendsNotification()

      useSentryLogger(null, 'Finishing earnings routine!')
    } catch (err) {
      const errorMesage = 'Earnings scrappy failed with error: ' + err
      useSentryLogger(err, errorMesage)
    }
  }
}

module.exports = new EarningsController()
