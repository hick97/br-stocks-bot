const { splitCommand, removeCommandFromText } = require('./index')

describe('CommandHelper', () => {
  it('splitCommand -> should return the correct splitted values given a command', async () => {
    const regularMessage = { text: '/stock ITSA4 10 8.90' }
    const unformattedMessage = { text: ' /stock   ITSA4  10   8.90' }

    const resultWithRegularMessage = await splitCommand(regularMessage.text)
    const resultWithUnformattedMessage = await splitCommand(unformattedMessage.text)

    const expectedLength = 4
    const expectedResult = ['/stock', 'ITSA4', '10', '8.90']

    expect(resultWithRegularMessage).toHaveLength(expectedLength)
    expect(resultWithRegularMessage).toStrictEqual(expectedResult)

    expect(resultWithUnformattedMessage).toHaveLength(expectedLength)
    expect(resultWithUnformattedMessage).toStrictEqual(expectedResult)
  })

  it('removeCommandFromText -> should return text without command', () => {
    const command = '/sendtoall'
    const text = 'Some text here.'
    const regularMessage = { text: command + ' ' + text }

    const result = removeCommandFromText(regularMessage.text)

    expect(result.text).toBe(text)
    expect(result.command).toBe(command)
  })
})
