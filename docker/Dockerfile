#
# Development
#
FROM node:18-alpine as dev
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=development

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

COPY --chown=app:app ../package*.json ./

RUN npm install
RUN chown -R app:app /app/node_modules

COPY --chown=app:app ../src src/
COPY --chown=app:app ../tsconfig.json ./

RUN mkdir -p ./dist
RUN chown -R app:app ./dist

USER app

CMD [ "npm", "run", "start:dev" ]

#
# Production
#
FROM node:18-alpine as prod
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

COPY --chown=app:app ../package*.json ./

RUN npm install
RUN chown -R app:app /app/node_modules

COPY --chown=app:app ../src src/
COPY --chown=app:app ../tsconfig.json ./

COPY --chown=app:app ../nest-cli.json ./
RUN npm run build

RUN npm install --omit=dev
RUN npm cache clean --force
RUN chown -R app:app /app/node_modules

USER app

CMD [ "node", "dist/main.js" ]