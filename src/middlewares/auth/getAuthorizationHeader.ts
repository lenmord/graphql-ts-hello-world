import { Request } from 'express';

const getAuthorizationHeader = (req: Request): string | undefined => {
  // Confirm defined over using optional chaining, as req?.header() throws an error if header is undefined
  const header = req.header && req.header('ad-authorization');
  if (!header) return undefined;

  const [headerStart, token] = header.split(' ');
  if (headerStart === 'Bearer') return token;

  return header;
};

export default getAuthorizationHeader;
