export const getOsEnv = (key: string, defaultValue?: string): string | undefined => {
  const optionalOsEnv = process.env[key];
  if (optionalOsEnv === undefined) {
    return defaultValue;
  }

  return optionalOsEnv;
};

export const toBool = (value: string): boolean => value === 'true';

export const normalizePort = (port: string): number | string | boolean => {
  const parsedPort = parseInt(port, 10);
  if (Number.isNaN(parsedPort)) {
    // named pipe
    return port;
  }
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return false;
};
