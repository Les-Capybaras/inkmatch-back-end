const winston = require('winston')
require('winston-daily-rotate-file')

const { combine, timestamp, printf, colorize, align } = winston.format

const env = process.env.NODE_ENV || 'dev'

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${env}-app-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  maxFiles: '7d',
  dirname: 'logs',
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [fileRotateTransport],
})

module.exports = logger
