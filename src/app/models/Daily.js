const mongoose = require('mongoose')

const DailySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  failed: {
    type: Boolean,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Daily', DailySchema)
