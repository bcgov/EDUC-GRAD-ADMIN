'use strict';
const CronJob = require('cron').CronJob;
const log = require('../components/logger');
const cacheService = require('../components/cache-service');

try {
  // Reload the cache every midnight at 12:15 AM as external APIs reload their cache at 12:00 AM
  const reloadCache = new CronJob('0 15 0 * * *', async () => {
    log.info('Starting scheduled cache reload at 12:15 AM');
    try {
      await cacheService.loadCoreg39CoursesToMap();
      log.info('Reloaded coreg 39 courses cache');

      await cacheService.loadGenderCodes();
      log.info('Reloaded gender codes cache');

      await cacheService.loadStudentGradeCodes();
      log.info('Reloaded student grade codes cache');

      await cacheService.loadAssessmentTypeCodes();
      log.info('Reloaded assessment type codes cache');

      await cacheService.loadGradProgramCodes();
      log.info('Reloaded graduation program codes cache');

      await cacheService.loadOptionalProgramCodes();
      log.info('Reloaded optional program codes cache');

      await cacheService.loadLetterGradeCodes();
      log.info('Reloaded letter grade codes cache');

      await cacheService.loadCareerProgramCodes();
      log.info('Reloaded career program codes cache');

      await cacheService.loadCitizenshipCodes();
      log.info('Reloaded citizenship codes cache');

      await cacheService.loadCountryCodes();
      log.info('Reloaded country codes cache');

      await cacheService.loadProvinceCodes();
      log.info('Reloaded province codes cache');

      await cacheService.loadExaminableCourses();
      log.info('Reloaded examinable courses cache');

      await cacheService.loadCourseRestrictions();
      log.info('Reloaded course restrictions cache');

      log.info('Scheduled cache reload completed successfully');
    } catch (e) {
      log.error('Error during scheduled cache reload:', e);
    }
  });

  reloadCache.start();
  log.info('Cache reload scheduler started - will run daily at 12:15 AM');
} catch (e) {
  log.error('Error starting cache reload scheduler:', e);
}

