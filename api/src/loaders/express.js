const bodyParser = require('body-parser')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const morganMiddleware = require('./morgan')
const logger = require('./logger')

module.exports = (app) => {
  app.use(cors())
  app.use(bodyParser.json())

  const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    statusCode: 429,
  })

  // Rate Limiter
  app.use(limiter)

  // Http Logger
  app.use(morganMiddleware)

  // Swagger
  require('../swagger')(app)

  // Routes
  require('../routes/user.routes')(app)
  require('../routes/auth.routes')(app)
  require('../routes/media.routes')(app)

  logger.info('Log has been started ...')
}
