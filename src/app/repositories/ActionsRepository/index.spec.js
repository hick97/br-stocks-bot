const Actions = require('./index')
const { SingleCommandsActions } = require('../../enum/CommandEnum')

describe('Actions', () => {
  it('staticMessage -> should return the correct message given a /help command', async () => {
    const message = { text: '/help' }

    const result = await Actions.staticMessage(message)

    expect(result).toBeTruthy()
    expect(result).toMatch(SingleCommandsActions['/help'])
  })

  it('staticMessage -> should return the correct message given a /start command', async () => {
    const message = { text: '/start' }

    const result = await Actions.staticMessage(message)

    expect(result).toBeTruthy()
    expect(result).toMatch(SingleCommandsActions['/start'])
  })

  it('getAction -> should return the correct action value given a command', () => {
    const message = { text: '/stock ITSA3 10 5.50' }

    const result = Actions.getAction(message)

    expect(result).toBeTruthy()
    expect(result).toMatch('/stock')
  })

  it('should return a falsy value to invalid commands', async () => {
    const message = { text: '/invalid' }

    const handleWalletResult = await Actions.handleWallet(message)
    const staticMessageResult = await Actions.staticMessage(message)
    const handleFundamentalsResult = await Actions.handleFundamentals(message)

    expect(handleWalletResult).toBeFalsy()
    expect(staticMessageResult).toBeFalsy()
    expect(handleFundamentalsResult).toBeFalsy()
  })
})
