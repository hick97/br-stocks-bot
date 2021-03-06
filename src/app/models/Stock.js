const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  marketOpen: {
    type: String,
    required: true
  },
  marketClose: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Stock', StockSchema)
