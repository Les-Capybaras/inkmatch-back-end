const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize, align } = winston.format;


const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${process.env.NODE_ENV}-app-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  maxFiles: '7d',
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [ fileRotateTransport ]
});

module.export = logger