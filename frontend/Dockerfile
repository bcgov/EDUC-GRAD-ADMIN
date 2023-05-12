FROM artifacts.developer.gov.bc.ca/docker-remote/node:16.17.1 as build-stage
WORKDIR /frontend

RUN echo "GRAD_VERSION=${GRAD_VERSION}"
RUN echo "const version = '${process.env.EDUC_GRAD_VERSION}';\n\nmodule.exports = { version };" > ./src/config/config.js

COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build
FROM artifacts.developer.gov.bc.ca/docker-remote/caddy:2.4.6-alpine as caddy-stage

EXPOSE 2015
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build-stage /frontend/dist /srv
