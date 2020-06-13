const mongoose = require('mongoose')

const QuoteSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
  latestTradingDay: {
    type: String,
    required: true
  },
  previousClose: {
    type: Number,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  changePercent: {
    type: String,
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

module.exports = mongoose.model('Quote', QuoteSchema)
