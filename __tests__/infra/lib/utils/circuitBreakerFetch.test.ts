import circuitBreakerFetch, { options } from '../../../../src/infra/lib/utils/circuitBreakerFetch';

jest.mock('node-fetch');
const fetch = require('node-fetch');

const { Request } = jest.requireActual('node-fetch');
const mockURL = new URL('http://www.somethingtest.com/testpage.html');

describe('circuitBreakerFetch', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should trigger a call upon receiving a request', () => {
    fetch.mockReturnValueOnce(Promise.resolve('success'));
    const req = new Request(mockURL);

    return circuitBreakerFetch(req).then(result => {
      expect(fetch.mock.calls[0][1].body).not.toBeDefined();
      expect(fetch.mock.calls[0][1].method).toBe('GET');
      expect(result).toEqual('success');
    });
  });

  it('should append a body if the request is not a GET', () => {
    fetch.mockReturnValueOnce(Promise.resolve('success'));
    const req = new Request(mockURL, { method: 'POST', body: { key: 'value' } });

    return circuitBreakerFetch(req).then(result => {
      expect(fetch.mock.calls[0][1].body).toBeDefined();
      expect(fetch.mock.calls[0][1].method).toBe('POST');
      expect(result).toEqual('success');
    });
  });

  it(`should timeout the request if it takes longer than ${options.timeout}ms`, async () => {
    jest.useFakeTimers();
    fetch.mockReturnValueOnce(Promise.resolve('return value'));

    const req = new Request(mockURL);
    const fetchPromise = circuitBreakerFetch(req);

    jest.advanceTimersByTime(options.timeout + 1);
    return expect(fetchPromise).rejects.toThrow(`Timed out after ${options.timeout}ms`);
  });
});
