const mongoose = require('mongoose')

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Analytics'
  },
  commandsCount: [
    {
      command: { type: String },
      count: { type: Number }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Track', TrackSchema)
