import winston from "winston";
import os from "os";

const { combine, timestamp, printf, colorize, align } = winston.format;

export class Logger {
    private logger: winston.Logger;
    private verbose: boolean;
    private quiet: boolean;

    constructor(verbose = false, quiet = false) {
        this.verbose = verbose;
        this.quiet = quiet;

        this.logger = winston.createLogger({
            level: "info",
            format: combine(
                timestamp({
                    format: "YYYY-MM-DD hh:mm:ss.SSS A",
                }),
                align(),
                printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
            ),
            transports: [],
            silent: this.quiet,
        });

        if (process.env.NODE_ENV === "production") {
            const fs = require("fs");
            if (!fs.existsSync("logs")) {
                fs.mkdirSync("logs");
            }
            this.logger.add(
                new winston.transports.File({
                    filename: "logs/error.log",
                    level: "error",
                })
            );
            this.logger.add(
                new winston.transports.File({ filename: "logs/combined.log" })
            );
        } else {
            this.logger.add(
                new winston.transports.Console({
                    format: combine(colorize({ all: true })),
                })
            );
        }
    }

    log(message: string, ...meta: any[]) {
        if (this.verbose) {
            const systemData = {
                timestamp: new Date().toISOString(),
                platform: os.platform(),
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                cpuModel: os.cpus()[0]?.model || "Unknown",
            };

            this.logger.info("--- SYSTEM DATA ---");
            this.logger.info(JSON.stringify(systemData, null, 2));
            this.logger.info("--- MESSAGE ---");
        }
        this.logger.info(message, ...meta);
    }

    error(message: string, ...meta: any[]) {
        this.logger.error(message, ...meta);
    }

    warn(message: string, ...meta: any[]) {
        this.logger.warn(message, ...meta);
    }

    debug(message: string, ...meta: any[]) {
        this.logger.debug(message, ...meta);
    }
}
