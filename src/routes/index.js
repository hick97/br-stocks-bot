const express = require('express')
const axios = require('axios')
const telegramApi = require('../app/services/api')

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('OK')
})

routes.post('/message', async (req, res) => {
  try {
    const { message } = req.body

    if (!message || message.text.toLowerCase().indexOf('marco') < 0) {
      // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
      throw Error('Invalid message or message is not found')
    }

    await axios.post(`${telegramApi.baseURL}/sendMessage`, {
      chat_id: message.chat.id,
      text: 'Polo!!'
    })

    return res.json({
      chat_id: message.chat.id,
      text: 'Polo!!'
    })
  } catch (err) {
    res.end('Error: ' + err.message)
  }
})

module.exports = routes
