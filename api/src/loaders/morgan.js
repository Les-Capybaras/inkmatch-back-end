const winston = require('winston');
const morgan = require('morgan');
require('winston-daily-rotate-file');

const { combine, timestamp, colorize, json } = winston.format;


const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${process.env.NODE_ENV}-http-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  maxFiles: '7d',
});

const httpLogger = winston.createLogger({
  level: 'http',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [ fileRotateTransport ]
});

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => httpLogger.http(message.trim()),
      },
    }
  );

module.export = morganMiddleware