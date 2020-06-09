/* eslint-disable import/first */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cron = require('node-cron')

const cors = require('cors')

const databaseConfig = require('./config/database')
const reportJob = require('./app/controllers/ReportController')
const routes = require('./routes')

class App {
  constructor() {
    this.express = express()

    this.middlewares()
    this.database()
    this.routes()
    this.jobs()
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

  jobs() {
    cron.schedule('30 19 * * *', () => {
      reportJob.execute()
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    })
  }
}

module.exports = new App().express
