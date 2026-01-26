import { logger as winstonLogger } from './winston-logger';

const mapLogOutput = (item: any) => {
  return typeof item === 'string' ? item : JSON.stringify(item);
};

export class Logger {
  #verbose = false;
  #quiet = false;

  constructor(verbose = false, quiet = false) {
    const args = process.argv.slice(2);
    this.#verbose = verbose || args.includes('--verbose');
    this.#quiet = quiet || args.includes('--quiet');
  }

  log(...data: any) {
    if (this.#quiet) {
      return;
    }

    const message = data.map(mapLogOutput).join(' ');

    if (this.#verbose) {
      winstonLogger.debug(message);
    } else {
      winstonLogger.info(message);
    }
  }

  error(...data: any) {
    const message = data.map(mapLogOutput).join(' ');
    winstonLogger.error(message);
  }

  warn(...data: any) {
    const message = data.map(mapLogOutput).join(' ');
    winstonLogger.warn(message);
  }

  debug(...data: any) {
    const message = data.map(mapLogOutput).join(' ');
    winstonLogger.debug(message);
  }

  info(...data: any) {
    const message = data.map(mapLogOutput).join(' ');
    winstonLogger.info(message);
  }
}
