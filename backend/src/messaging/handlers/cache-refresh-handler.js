'use strict';
const log = require('../../components/logger');
const NATS = require('../message-pub-sub');
const {StringCodec} = require('nats');
const cacheService = require('../../components/cache-service');
const EventEmitter = require('events');
const sc = StringCodec();

const CACHE_REFRESH_TOPIC = 'CACHE_REFRESH';
const cacheRefreshEmitter = new EventEmitter();

async function subscribeToCacheRefreshTopic(nats) {
  const opts = {};

  const sub = nats.subscribe(CACHE_REFRESH_TOPIC, opts);
  log.debug(`Service listening to ${CACHE_REFRESH_TOPIC}`);

  for await (const msg of sub) {
    const dataStr = sc.decode(msg.data);
    const data = JSON.parse(dataStr);
    log.debug(`Received cache refresh message  :: cacheType: ${data.cacheType}, triggeredBy: ${data.triggeredBy}`);

    try {
      if (data.cacheType === 'courseRestrictions') {
        await cacheService.loadCourseRestrictions();
        log.debug('Course restrictions cache refreshed successfully');
        cacheRefreshEmitter.emit('courseRestrictions:refreshed');
      }
    } catch (error) {
      log.error(`Error refreshing ${data.cacheType} cache:`, error);
      cacheRefreshEmitter.emit('courseRestrictions:error', error);
    }
  }
}

const CacheRefreshMessageHandler = {
  subscribe() {
    subscribeToCacheRefreshTopic(NATS.getConnection());
  },

  // Wait for next cache refresh to complete
  waitForCacheRefresh(cacheType, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout waiting for ${cacheType} cache refresh`));
      }, timeout);

      const onRefreshed = () => {
        cleanup();
        resolve();
      };

      const onError = (error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        clearTimeout(timer);
        cacheRefreshEmitter.removeListener(`${cacheType}:refreshed`, onRefreshed);
        cacheRefreshEmitter.removeListener(`${cacheType}:error`, onError);
      };

      cacheRefreshEmitter.once(`${cacheType}:refreshed`, onRefreshed);
      cacheRefreshEmitter.once(`${cacheType}:error`, onError);
    });
  }
};

module.exports = CacheRefreshMessageHandler;

