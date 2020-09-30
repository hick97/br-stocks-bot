const Actions = require('./index')
const singleCommands = require('../../helpers/singleCommandsFunc')

describe('Actions', () => {
  it('staticMessage -> should return the correct message given a /help command', async () => {
    const message = { text: '/help' }

    const result = await Actions.staticMessage(message)

    expect(result).toBeTruthy()
    expect(result).toMatch(singleCommands['/help'])
  })

  it('staticMessage -> should return the correct message given a /start command', async () => {
    const message = { text: '/start' }

    const result = await Actions.staticMessage(message)

    expect(result).toBeTruthy()
    expect(result).toMatch(singleCommands['/start'])
  })

  it('staticMessage -> should return a falsy value to invalid commands', async () => {
    const message = { text: '/invalid' }

    const result = await Actions.staticMessage(message)

    expect(result).toBeFalsy()
  })
})
