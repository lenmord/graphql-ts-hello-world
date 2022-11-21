import { Application } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import TranslationService from '../dataSources/translationService';
import circuitBreakerFetch from '../infra/lib/utils/circuitBreakerFetch';
import { Context, ContextRequest, User } from './types';

const context = ({ req }: { req: ContextRequest }): Context => {
  const user: User = {
    permissions: req?.user?.permissions || [],
    tenant: req.header('ad-tenant') || 'APPDIRECT',
    locale: req.header('locale') || 'en-US',
    localizationPath: req.header('localizationPath') || 'http://localization'
  };
  return { user };
};

const translationStore = new TranslationService(circuitBreakerFetch);
const dataSources = () => ({
  translationStore
});

const apolloMiddleware = (app: Application) => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => 'Hello world!'
    }
  };
  const path = '/api/v1/graphql-ts-hello-world/graphql';

  const server = new ApolloServer({ typeDefs, resolvers, dataSources, context });
  server.applyMiddleware({ app, path });
};

export default apolloMiddleware;
