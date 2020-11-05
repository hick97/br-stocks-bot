const { getCurrentDate } = require('../../helpers/reportHelper')

export const logMessages = {
  start: `Starting daily quotes on ${getCurrentDate({ withHTML: false })}...`,
  finish: `All reports were sent on ${getCurrentDate({ withHTML: false })}...`
}
