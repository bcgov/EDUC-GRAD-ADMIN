FROM docker-remote.artifacts.developer.gov.bc.ca/node:16.16.0 as build-stage
WORKDIR /opt/app-root/src
COPY package*.json ./
RUN npm --version
RUN node -v
RUN npm ci --loglevel verbose

# Build Application
COPY . /opt/app-root/src
EXPOSE 8080 443
RUN npm run build

FROM ghcr.io/bcgov/grad-caddy:v1 as caddy-stage
COPY --from=build-stage /opt/app-root/src/dist/app/view /var/www/html
COPY --from=build-stage /opt/app-root/src/Caddyfile /etc/Caddyfile
CMD /tmp/scripts/run
