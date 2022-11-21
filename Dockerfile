FROM node:14-alpine as transpile

ENV NO_UPDATE_NOTIFIER=true

ENV HOME=/home/node
WORKDIR /app
RUN adduser node root && \
    chown node:root /app $HOME && \
    chmod g=u /app $HOME
USER node:root

COPY --chown=node:root .npmrc package.json package-lock.json ./
COPY --chown=node:root tsconfig.json tsconfig.eslint.json ./
COPY --chown=node:root .eslintrc .eslintignore .prettierrc ./
COPY --chown=node:root src ./src

RUN npm ci && \
    npm cache clean --force

ARG version=patch
RUN npm version "$version"

EXPOSE 3434
ENTRYPOINT ["npm"]

# transpile files
RUN npx tsc -p ./tsconfig.json
COPY --chown=node:root src/domain/*.graphql ./dist/domain

###

FROM transpile as test

COPY --chown=node:root __tests__ ./__tests__
RUN npm ci && \
    npm cache clean --force
CMD ["test"]

###

FROM transpile as smoke

COPY --chown=node:root __smoke__ ./__smoke__
# remove extra folders to reduce the size of an image
RUN rm -rf ./src ./dist

RUN npm ci && \
    npm cache clean --force
CMD ["run", "test:smoke"]

###

FROM node:14-alpine as production

ENV NO_UPDATE_NOTIFIER=true

ENV HOME=/home/node
WORKDIR /app
RUN adduser node root && \
    chown node:root /app $HOME && \
    chmod g=u /app $HOME
USER node:root

COPY --chown=node:root .npmrc package.json package-lock.json ./
COPY --from=transpile --chown=node:root /app/dist ./dist
RUN npm ci --only=production && \
    npm cache clean --force

ARG version=patch
RUN npm version "$version"

EXPOSE 3434
ENTRYPOINT ["npm"]
CMD ["start"]
