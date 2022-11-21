import fetch, { Request, Response } from 'node-fetch';
import CircuitBreaker from 'opossum';

export const options = {
  timeout: 1000,
  errorThresholdPercentage: 50,
  resetTimeout: 15000
};

const generateRequestBody = (req: Request) => (req.method !== 'GET' ? req.body : undefined);

const generateAsyncRequest = async (req: Request): Promise<Response> =>
  fetch(req.url, { method: req.method, body: generateRequestBody(req), headers: req.headers });

const breaker = new CircuitBreaker(generateAsyncRequest, options);

const circuitBreakerFetch = async (req: Request): Promise<any> => breaker.fire(req);

export default circuitBreakerFetch;
