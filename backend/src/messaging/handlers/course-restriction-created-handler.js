'use strict';
const log = require('../../components/logger');
const NATS = require('../message-pub-sub');
const cacheService = require('../../components/cache-service');
const EventEmitter = require('events');

const COURSE_RESTRICTION_TOPIC = 'COURSE_RESTRICTION_CREATED';
const cacheRefreshEmitter = new EventEmitter();

async function subscribeToCourseRestrictionTopic(nats) {
  const opts = {};

  const sub = nats.subscribe(COURSE_RESTRICTION_TOPIC, opts);
  log.debug(`Service listening to ${COURSE_RESTRICTION_TOPIC}`);

  for await (const msg of sub) {
    if (msg) {
      log.debug('Received course restriction event, refreshing cache');

      try {
        await cacheService.loadCourseRestrictions();
        log.debug('Course restrictions cache refreshed successfully');
        cacheRefreshEmitter.emit('courseRestrictions:refreshed');
      } catch (error) {
        log.error('Error refreshing course restrictions cache:', error);
        cacheRefreshEmitter.emit('courseRestrictions:error', error);
      }
    }
  }
}

const CacheRefreshMessageHandler = {
  subscribe() {
    subscribeToCourseRestrictionTopic(NATS.getConnection()).catch((error) => {
      log.error('Error in course restriction subscription:', error);
    });
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

