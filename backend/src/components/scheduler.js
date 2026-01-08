'use strict';
const CronJob = require('cron').CronJob;
const log = require('../components/logger');
const cacheService = require('../components/cache-service');
const config = require('../config/index');

try {
  // Reload the cache every midnight at 12:15 AM as external APIs reload their cache at 12:00 AM
  const reloadCache = new CronJob('0 15 0 * * *', async () => {
    log.info('Starting scheduled cache reload at 12:15 AM');
    try {
      await cacheService.loadCoreg39CoursesToMap();
      log.info('Reloaded coreg 39 courses cache');

      await cacheService.loadStudentGradeCodes();
      log.info('Reloaded student grade codes cache');

      log.info('Scheduled cache reload completed successfully');
    } catch (e) {
      log.error('Error during scheduled cache reload:', e);
    }
  });

  // Only start cron if CRUD is enabled
  const crudEnabled = config.get('frontendConfig').enableCRUD;
  if (crudEnabled) {
    reloadCache.start();
    log.info('Cache reload scheduler started - will run daily at 12:15 AM');
  }
} catch (e) {
  log.error('Error starting cache reload scheduler:', e);
}

