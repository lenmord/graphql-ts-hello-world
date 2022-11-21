# GraphQL TypeScript Hello World

NodeJS API Project template for typescript projects.

This project contains a GraphQL-Typescript-Apollo application with the following examples:
- Unit tests
- Smoke tests
- Deployment folder up to test
- Tracing
- Logging
- Apollo Middleware setup
- Data source integration with circuit breaker (localization service)
- AD token deserialization (then exposed in datasource)

This repository can be leveraged as a starting point for any typescript-based graphql API

## Running locally

- build: `npm run start:build`
- Server: `npm start` or `npm run start`
- watch mode: `npm run dev`

When running locally, a `localizationPath` is needed as part of the headers sent in the request being tested.
Without this header, no translations will be applied.

## Tests

### Unit Tests

    npm run test

### Smoke tests

You can run smoke tests with

    npm run test:smoke
    
note however that the service must be running beforehand with
    
    npm run dev
