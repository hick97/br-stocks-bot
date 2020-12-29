const { shareByWhatsapp } = require('./index')

describe('SocialHelper', () => {
  it('shareByWhatsapp -> should return the correct whatsapp link with text', async () => {
    const textToSend = 'testing'
    const expectedUrl = `https://api.whatsapp.com/send?text=${textToSend}`

    const result = shareByWhatsapp(textToSend)
    const { url } = result.inline_keyboard[0][0]

    expect(url).toBe(expectedUrl)
  })
})
