import winston from "winston";

const transports = [new winston.transports.Console()];

const LoggerInstance = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports,
});

export default LoggerInstance;
