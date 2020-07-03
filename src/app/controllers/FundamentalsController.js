const FundamentalsRepository = require('../repositories/FundamentalsRepository')

class MessageController {
  async execute(message) {
    const { text } = message

    const keys = text.split(' ').map(function (item) {
      return item.trim()
    })
    const values = keys.filter(element => element !== '')
    const symbol = values[1]

    const fundamentals = await FundamentalsRepository.getFundamentalsByStock(symbol)
    const fundamentalsText = await FundamentalsRepository.getFundamentalsText(fundamentals, symbol)

    return fundamentalsText
  }
}

module.exports = new MessageController()
