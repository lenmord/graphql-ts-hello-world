import { Request, Response, NextFunction } from 'express';
import { Tracer, ConsoleRecorder, ExplicitContext, BatchRecorder, jsonEncoder } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { expressMiddleware } from 'zipkin-instrumentation-express';

const { TRACING_CONTEXT } = require('../../../constants');
const { name: localServiceName, tracing } = require('../../../env');

const ctxImpl = new ExplicitContext();
const recorder = tracing.debug
  ? new ConsoleRecorder()
  : new BatchRecorder({
      logger: new HttpLogger({
        endpoint: `${tracing.zipkinUrl}/api/v2/spans`,
        jsonEncoder: jsonEncoder.JSON_V2
      })
    });

module.exports = (req: Request, res: Response, next: NextFunction) => {
  req[TRACING_CONTEXT] = ctxImpl;
  const tracer = new Tracer({ ctxImpl, recorder, localServiceName });
  expressMiddleware({ tracer })(req, res, next);
};
