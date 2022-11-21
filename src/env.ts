import * as dotenv from 'dotenv';

import { getOsEnv, normalizePort, toBool } from './infra/lib/env';

dotenv.config();

/**
 * Environment variables
 */
const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  name: getOsEnv('APP_NAME', 'graphql-ts-hello-world'),
  host: getOsEnv('APP_HOST', 'http://localhost'),
  port: normalizePort(getOsEnv('PORT', '3434')),

  log: {
    level: getOsEnv('LOG_LEVEL', 'info'),
    json: toBool(getOsEnv('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT')
  },
  tracing: {
    enabled: toBool(getOsEnv('TRACING_ENABLED', 'false')),
    debug: toBool(getOsEnv('TRACING_DEBUG', 'false')),
    zipkinUrl: getOsEnv('ZIPKIN_BASE_URL', 'http://localhost:9411')
  }
};

module.exports = env;
