import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize } = winston.format;

const devFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const prodFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const isProd = process.env.NODE_ENV === 'production';

const transports = isProd
    ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
      }),
      new winston.transports.File({
        filename: 'logs/combined.log'
      })
    ]
    : [
      new winston.transports.Console({
        format: combine(colorize(), timestamp(), devFormat)
      })
    ];

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), prodFormat),
  transports
});

// Helper shortcuts
export const logInfo = (msg: string) => logger.info(msg);
export const logError = (msg: string) => logger.error(msg);
export const logDebug = (msg: string) => logger.debug(msg);
