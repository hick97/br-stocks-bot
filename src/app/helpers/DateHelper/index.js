const { emojis } = require('../../enum/EmojiEnum')

const getCurrentDate = (withHTML = true) => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()

  const currentDate = dd + '/' + mm + '/' + yyyy

  return withHTML ? ('<b>' + emojis.calendar + ' ' + currentDate + '</b>') : currentDate
}

const isWeekend = (date) => {
  const prohibitedWeekdays = {
    sunday: 0,
    saturday: 6
  }

  const today = date ? new Date(date) : new Date()
  const dayOfWeek = today.getDay()
  const result = dayOfWeek === prohibitedWeekdays.saturday || dayOfWeek === prohibitedWeekdays.sunday

  return result
}

module.exports = { getCurrentDate, isWeekend }
