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
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Wallet', WalletSchema)
