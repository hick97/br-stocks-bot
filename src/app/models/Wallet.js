const mongoose = require('mongoose')

const WalletSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Minha carteira'
  },
  chat_id: {
    type: Number,
    required: true
  },
  stocks: [
    {
      stock: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  previousData: {
    investedAmount: {
      type: Number
    },
    cashResult: {
      type: Number
    },
    percentualResult: {
      type: Number
    },
    withPreviousData: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Wallet', WalletSchema)
