'use strict';
const log = require('../../components/logger');
const NATS = require('../message-pub-sub');
const cacheService = require('../../components/cache-service');
const EventEmitter = require('events');
const {AckPolicy, DeliverPolicy, StringCodec} = require('nats');

const GRAD_COURSE_EVENTS_TOPIC = 'GRAD_COURSE_EVENTS_TOPIC';
const STREAM_NAME = 'GRAD_COURSE_EVENTS';
const cacheRefreshEmitter = new EventEmitter();
const sc = StringCodec();

async function subscribeToGradCourseEventsTopic(nats) {
  const jetStream = nats.jetstream();

  const consumerOpts = {
    config: {
      durable_name: 'grad-admin-course-events',
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.New,
      deliver_subject: 'grad-admin-course-events-deliver'
    },
    stream: STREAM_NAME
  };

  log.info(`Service listening to ${GRAD_COURSE_EVENTS_TOPIC} stream for course events from Java API`);

  const sub = await jetStream.subscribe(GRAD_COURSE_EVENTS_TOPIC, consumerOpts);

  for await (const msg of sub) {
    try {
      const dataStr = sc.decode(msg.data);
      const event = JSON.parse(dataStr);

      log.debug(`Received course event :: eventType: ${event.eventType}, eventOutcome: ${event.eventOutcome}`);

      if (event.eventOutcome === 'COURSE_RESTRICTION_CREATED' ||
          event.eventOutcome === 'COURSE_RESTRICTION_UPDATED') {

        log.debug('Course restriction event detected, refreshing cache');
        await cacheService.loadCourseRestrictions();
        log.debug('Course restrictions cache refreshed successfully');

        cacheRefreshEmitter.emit('courseRestrictions:refreshed');
      } else {
        log.debug(`Ignoring event with outcome: ${event.eventOutcome}`);
      }

      msg.ack();
    } catch (error) {
      log.error('Error processing course event:', error);
      cacheRefreshEmitter.emit('courseRestrictions:error', error);
      msg.nak();
    }
  }
}

const GradCourseEventsHandler = {
  subscribe() {
    subscribeToGradCourseEventsTopic(NATS.getConnection()).catch((error) => {
      log.error('Error in grad course events subscription:', error);
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

module.exports = GradCourseEventsHandler;

