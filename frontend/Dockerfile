FROM node:14.19.0 as build-stage
WORKDIR /opt/app-root/src
COPY package*.json ./
RUN npm --version
  
RUN node -v
RUN npm i --no-optional
# Build Application
COPY . /opt/app-root/src
RUN npm run build

FROM zzrot/alpine-caddy:v0.9.5 as caddy-stage
COPY --from=build-stage /opt/app-root/src/dist/app/view /var/www/html
COPY --from=build-stage /opt/app-root/src/Caddyfile /etc/Caddyfile
CMD /tmp/scripts/run
