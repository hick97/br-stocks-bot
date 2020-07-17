/* eslint-disable import/first */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Youch = require('youch')
const Sentry = require('@sentry/node')
require('express-async-errors')
const cron = require('node-cron')

const cors = require('cors')

const databaseConfig = require('./config/database')
const reportJob = require('./app/controllers/ReportController')

const routes = require('./routes')
const staticMessages = require('./app/enum/messages')

const ScrappyRepository = require('./app/repositories/ScrappyRepository')

// const sentryConfig = require('./config/sentry')

class App {
  constructor() {
    this.express = express()

    Sentry.init({ dsn: 'https://1ccb884af5624f3da3fefd1bb389b80d@o257510.ingest.sentry.io/5283610' })

    this.middlewares()
    this.database()
    this.routes()
    this.jobs()
    this.exceptionHandler()
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares() {
    this.express.use(Sentry.Handlers.requestHandler())
    this.express.use(express.json())
    this.express.use(cors())
  }

  routes() {
    this.express.use(routes)
    this.express.use(Sentry.Handlers.errorHandler())
  }

  jobs() {
    // ScrappyRepository.getFundamentals('SULA11')
    // reportJob.execute()

    cron.schedule('30 18 * * *', () => {
      reportJob.execute()
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    })
  }

  exceptionHandler() {
    this.express.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON()
        return res.status(500).json(errors)
      }
      Sentry.captureException(err)
      return res.json({ error: staticMessages.ERROR_MESSAGE })
    })
  }
}

module.exports = new App().express
