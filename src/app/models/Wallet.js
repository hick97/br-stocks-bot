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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Wallet', WalletSchema)
