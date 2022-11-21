import { createTerminus } from '@godaddy/terminus';
import { Server } from 'http';
import logger from '../logger';

const healthCheck = (app: Server) => {
  const onSignal = () => {
    logger.info('server is starting cleanup');
    return Promise.all([
      // your clean logic, like closing database connections
    ]);
  };

  const onShutdown = () => {
    logger.info('cleanup finished, server is shutting down');
    return Promise
      .resolve
      // optionally include a resolve value to be included as
      // info in the health check response
      ();
  };

  const onHealthCheck = () =>
    Promise.resolve(
      // optionally include a resolve value to be included as
      // info in the health check response
      200
    );
  const beforeShutdown = () =>
    // given your readiness probes run every 5 second
    new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
  const options = {
    healthChecks: {
      '/health': onHealthCheck
    },
    onShutdown,
    onSignal,
    beforeShutdown
  };

  createTerminus(app, options);
};

export default healthCheck;
