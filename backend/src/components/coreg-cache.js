'use strict';
const { logApiError, errorResponse} = require('./utils');
const HttpStatus = require('http-status-codes');
const cacheService = require('./cache-service');


function getCoreg38Courses(req, res) {
  try {
    let courses = cacheService.getAllSchoolsJSON();
    return res.status(HttpStatus.OK).json(courses);
  } catch (e) {
    logApiError(e, 'getSchools', 'Error occurred while attempting to getCoreg38Courses.');
    return errorResponse(res);
  }
}

function getCoreg39Courses(req, res) {
  try {
    let courses = cacheService.getAllSchoolsJSON();
    return res.status(HttpStatus.OK).json(courses);
  } catch (e) {
    logApiError(e, 'getSchools', 'Error occurred while attempting to getCoreg39Courses.');
    return errorResponse(res);
  }
}

module.exports = {
  getCoreg38Courses,
  getCoreg39Courses
};
