const Sentry = require('@sentry/node')

const useSentryLogger = (error, info) => {
  error && Sentry.captureException(error)
  info && Sentry.captureMessage(info)
}

module.exports = { useSentryLogger }
