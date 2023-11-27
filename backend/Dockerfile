FROM artifacts.developer.gov.bc.ca/docker-remote/node:14.20.1-alpine3.16

RUN apk add --no-cache tzdata
ENV TZ=America/Vancouver

RUN mkdir -p /logs
RUN chmod 775 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src
EXPOSE 443 8080
CMD ["npm", "start"]
