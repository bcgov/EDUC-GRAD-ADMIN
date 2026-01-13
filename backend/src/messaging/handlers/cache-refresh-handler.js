'use strict';
const log = require('../../components/logger');
const NATS = require('../message-pub-sub');
const {StringCodec} = require('nats');
const cacheService = require('../../components/cache-service');
const sc = StringCodec();

const CACHE_REFRESH_TOPIC = 'GRAD_ADMIN_CACHE_REFRESH';

async function subscribeToCacheRefreshTopic(nats) {
  const opts = {};

  const sub = nats.subscribe(CACHE_REFRESH_TOPIC, opts);
  log.info(`Service listening to ${CACHE_REFRESH_TOPIC}`);

  for await (const msg of sub) {
    const dataStr = sc.decode(msg.data);
    const data = JSON.parse(dataStr);
    log.debug(`Received message, on ${msg.subject} , Subscription Id ::  [${msg.sid}], Reply to ::  [${msg.reply}] :: Data ::`, data);

    try {
      if (data.cacheType === 'courseRestrictions') {
        await cacheService.loadCourseRestrictions();
      }
    } catch (error) {
      log.error(`Error refreshing ${data.cacheType} cache:`, error);
    }
  }
}

const CacheRefreshMessageHandler = {
  subscribe() {
    subscribeToCacheRefreshTopic(NATS.getConnection());
  },
};

module.exports = CacheRefreshMessageHandler;

