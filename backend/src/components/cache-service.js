'use strict';
const config = require('../config/index');
const log = require('../components/logger');
const {getCommonServiceData} = require('../components/utils');
const retry = require('async-retry');
const {generateCourseObject} = require('../util/courseUtils');

let courses39Map = new Map();
let courses39 = [];
let courses39ExternalCodeMap = new Map();

const cacheService = {
  async loadCoreg39CoursesToMap() {
    log.debug('Loading all courses39');
    await retry(async () => {
      try {
        // if anything throws, we retry
        console.log(`${config.get('server:coregAPIURL')}/all/39`);

        const coreg39CourseResponse = await getCommonServiceData(`${config.get('server:coregAPIURL')}/api/v1/course/information/all/39`);
        courses39 = []; // reset the value.
        courses39Map.clear();// reset the value.
        courses39ExternalCodeMap.clear(); // reset the externalCode map
        if (coreg39CourseResponse && coreg39CourseResponse.length > 0) {
          for (const course of coreg39CourseResponse) {
            const courseObject = generateCourseObject(course);
            courses39Map.set(courseObject.courseID, courseObject);
            courses39.push(courseObject);
            if (courseObject.externalCode) {
              courses39ExternalCodeMap.set(courseObject.externalCode, courseObject.courseID);
            }
          }
        }
        log.info(`Loaded ${courses39Map.size} coreg39Courses.`);
      } catch (err) {
        log.error('Failed to load coreg39 courses, will retry:', err);
        throw err;
      }
    }, {
      retries: 50
    });
  },
  getAllCoreg39CoursesJSON() {
    return courses39;
  },
  getCoreg39CourseByID(courseID) {
    return courses39Map.get(courseID);
  },
  getCourseIDByExternalCode39(externalCode) {
    return courses39ExternalCodeMap.get(externalCode);
  },
};

module.exports = cacheService;
