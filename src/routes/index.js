const express = require('express')
const MessageController = require('../app/controllers/MessageController')

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('ROBOT ONLINE')
})

routes.post('/message', MessageController.execute)

module.exports = routes
