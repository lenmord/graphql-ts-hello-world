import { Request } from 'express';

export type User = {
  permissions: string[];
  tenant: string;
  locale: string;
  localizationPath: string;
};

export type Context = {
  user: User;
};

export type ContextRequest = Request & {
  user?: User;
};
