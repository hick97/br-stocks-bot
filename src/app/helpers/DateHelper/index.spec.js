const { isWeekend } = require('./index')

describe('DateHelper', () => {
  it('isWeekend -> should return a truthy value when date is saturday or sunday', async () => {
    const dates = {
      saturday: '01/09/2021',
      sunday: '01/10/2021'
    }

    const resultToSunday = isWeekend(dates.sunday)
    const resultToSaturday = isWeekend(dates.saturday)

    expect(resultToSunday).toBeTruthy()
    expect(resultToSaturday).toBeTruthy()
  })

  it('isWeekend -> should return a falsy value when date is not saturday or sunday', async () => {
    const dates = {
      monday: '01/04/2021',
      tuesday: '01/05/2021'
    }

    const resultToMonday = isWeekend(dates.monday)
    const resultToTuesday = isWeekend(dates.tuesday)

    expect(resultToMonday).toBeFalsy()
    expect(resultToTuesday).toBeFalsy()
  })
})
