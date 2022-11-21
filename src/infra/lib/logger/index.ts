import winston from 'winston';

const {
  log: { level },
  isDevelopment,
  name
} = require('../../../env');

const errorFormat = winston.format(logged => {
  if (logged instanceof Error) {
    return { ...logged, stack: logged.stack, message: logged.message };
  }
  return logged;
});

const devFormat = () => winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint());

const prodFormat = () =>
  winston.format.combine(winston.format.timestamp(), winston.format.simple(), errorFormat(), winston.format.json());

const format = isDevelopment ? devFormat() : prodFormat();

const logger = winston.createLogger({
  level,
  format,
  defaultMeta: { service: name },
  transports: [new winston.transports.Console()]
});

export default logger;
