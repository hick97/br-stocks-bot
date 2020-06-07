/* eslint-disable import/first */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const databaseConfig = require('./config/database')

const routes = require('./routes')

class App {
  constructor() {
    this.express = express()

    this.middlewares()
    this.database()
    this.routes()
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
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
