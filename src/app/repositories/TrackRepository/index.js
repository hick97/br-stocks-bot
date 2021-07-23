
const Track = require('../../models/Track')

class TrackRepository {
  async getCountByCommandLabel(command) {
    const tracks = await Track.find()

    const count = tracks.commandsCount.filter(item => item.command === command)

    return count
  }

  async updateCommandCount(command) {
    const tracks = await Track.findOne({ name: 'Analytics' })

    const indexToUpdate = tracks.commandsCount.findIndex(item => item.command === command)

    if (indexToUpdate === -1) {
      tracks.commandsCount = [...tracks.commandsCount, { command, count: 1 }]

      await tracks.save()
      return
    }

    const oldCount = tracks.commandsCount[indexToUpdate].count

    tracks.commandsCount[indexToUpdate] = { command, count: oldCount + 1 }

    await tracks.save()
  }
}

module.exports = new TrackRepository()
