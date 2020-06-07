// const axios = require('axios')

// const singleCommands = require('../enum/singleCommands')
// const staticMessages = require('../enum/messages')

class StockRepository {
  stockIsValid(message) {
    const { text } = message
    const regex = /\/stock|\/del/i
    const match = text.search(regex)

    if (match < 0) {
      return false
    }

    return true
  }
}

module.exports = new StockRepository()
