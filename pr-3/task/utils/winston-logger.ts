import winston from 'winston';
import path from 'path';
import fs from 'fs';

const NODE_ENV = process.env.NODE_ENV || 'development';
const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  }),
);

const transports: winston.transport[] = [];

if (NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: logFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: devFormat,
    }),
  );
}

export const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transports,
  exitOnError: false,
});

export default logger;
