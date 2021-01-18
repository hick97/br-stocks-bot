const mongoose = require('mongoose')

const EarningsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  resultAbsoluteValue: {
    type: String,
    required: true
  },
  limitDate: {
    type: String,
    required: true
  },
  paymentDate: {
    type: String,
    required: true
  },
  earningType: {
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

module.exports = mongoose.model('Earnings', EarningsSchema)
