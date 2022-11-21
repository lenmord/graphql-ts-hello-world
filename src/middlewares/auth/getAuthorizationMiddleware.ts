import { Request, RequestHandler as ExpressRequestHandler, Response, NextFunction } from 'express';
import expressJwt, { RequestHandler as ExpressJWTRequestHandler } from 'express-jwt';
import unless, { RequestHandler as UnlessRequestHandler } from 'express-unless';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

import getAuthorizationHeader from './getAuthorizationHeader';
import logger from '../../infra/lib/logger';

const { isDevelopment, isTest } = require('../../env');

const unlessWrapper = (handler: UnlessRequestHandler): UnlessRequestHandler => {
  // eslint-disable-next-line no-param-reassign
  handler.unless = unless;
  return handler;
};

// For local without authz
const jwtSkipper = (): ExpressRequestHandler => (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  req.user = {
    permissions: req.header('permissions') || [],
    tenant: req.header('tenant'),
    locale: req.header('locale')
  };
  // @ts-ignore
  next();
};

// For use in test
const jwtDecoder = (): ExpressRequestHandler => (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  req.user = jwt.decode(getAuthorizationHeader(req));
  next();
};

// For use in production
const jwtValidator = (authzBaseUrl: URL): ExpressJWTRequestHandler => {
  const certificatesUrl = new URL(authzBaseUrl.toString());
  certificatesUrl.pathname = `${authzBaseUrl.pathname}/api/v1/certs`.replace(/\/+/g, '/');
  return expressJwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: certificatesUrl.toString(),
      cache: true
    }),
    algorithms: ['RS256'],
    credentialsRequired: false, // If credentials invalid, should continue and try to leverage header values
    getToken: getAuthorizationHeader
  });
};

const getAuthorizationMiddleware = (authzBaseUrl: URL): UnlessRequestHandler | ExpressJWTRequestHandler => {
  if (isTest) {
    logger.info('Authentication: Decoding');
    return unlessWrapper(jwtDecoder());
  }
  if (isDevelopment) {
    logger.info('Authentication: Skipped');
    return unlessWrapper(jwtSkipper());
  }

  logger.info('Authentication: Validating');
  return jwtValidator(authzBaseUrl);
};

export default getAuthorizationMiddleware;
