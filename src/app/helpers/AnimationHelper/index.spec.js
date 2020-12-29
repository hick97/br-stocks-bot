const { getAnimationFile } = require('./index')

describe('AnimationHelper', () => {
  const commands = {
    withAnimation: '/start',
    withoutAnimation: '/helper'
  }

  it('getAnimationFile -> should return the correct filename when command has animation', async () => {
    const resultWithAnimation = getAnimationFile(commands.withAnimation)

    expect(resultWithAnimation).toBeTruthy()
  })

  it('getAnimationFile -> should return null when command has no animation', async () => {
    const resultWithoutAnimation = getAnimationFile(commands.withoutAnimation)

    expect(resultWithoutAnimation).toBeFalsy()
  })
})
