/* eslint-disable import/first */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes')

class App {
  constructor() {
    this.express = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(cors())
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new App().express
