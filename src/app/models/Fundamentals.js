const mongoose = require('mongoose')

const FundamentalsSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  indicators: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Fundamentals', FundamentalsSchema)
