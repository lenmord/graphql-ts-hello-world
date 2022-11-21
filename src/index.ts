import bodyParser from 'body-parser';
import compression from 'compression';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import morgan from 'morgan';

import routes from './infra/http/routes';
import { HttpError } from './infra/http/responses/Error';
import healthCheck from './infra/lib/utils/healthCheck';
import apolloMiddleware from './middlewares/apollo';
import getAuthorizationMiddleware from './middlewares/auth/getAuthorizationMiddleware';

const cookieParser = require('cookie-parser');
const { tracing } = require('./env');
const tracer = require('./infra/lib/tracer');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3434;
const authzBaseUrl = new URL('http://authz');

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(getAuthorizationMiddleware(authzBaseUrl));

if (tracing.enabled) {
  app.use(tracer);
}

app.use(morgan('tiny'));
app.use('/', routes);
apolloMiddleware(app);

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.httpCode || 500).json({ message: error.message });
});

const server = http.createServer(app);
healthCheck(server);
server.listen(PORT);

console.log(`Server started on port ${PORT}`);
