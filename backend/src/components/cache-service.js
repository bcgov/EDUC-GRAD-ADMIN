'use strict';
const config = require('../config/index');
const log = require('../components/logger');
const {getCommonServiceData} = require('../components/utils');
const retry = require('async-retry');
const {generateCourseObject} = require('../util/courseUtils');

let courses39Map = new Map();
let courses39 = [];
let courses39ExternalCodeMap = new Map();
let studentGradeCodes = [];
let assessmentTypeCodes = [];
let gradProgramCodes = [];

const cacheService = {
  async loadCoreg39CoursesToMap() {
    log.debug('Loading all courses39');
    await retry(async () => {
      try {
        // if anything throws, we retry
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
  async loadStudentGradeCodes() {
    log.debug('Loading student grade codes');
    await retry(async () => {
      try {
        const studentGradeCodesResponse = await getCommonServiceData(`${config.get('server:studentAPIURL')}/api/v1/student/grade-codes`);
        studentGradeCodes = []; // reset the value
        if (studentGradeCodesResponse && studentGradeCodesResponse.length > 0) {
          studentGradeCodes = studentGradeCodesResponse;
        }
        log.info(`Loaded ${studentGradeCodes.length} student grade codes.`);
      } catch (err) {
        log.error('Failed to load student grade codes, will retry:', err);
        throw err;
      }
    }, {
      retries: 50
    });
  },
  getStudentGradeCodesJSON() {
    return studentGradeCodes;
  },
  async loadAssessmentTypeCodes() {
    log.debug('Loading assessment type codes');
    await retry(async () => {
      try {
        const assessmentTypeCodesResponse = await getCommonServiceData(`${config.get('server:studentAssessmentAPIURL')}/api/v1/student-assessment/assessment-types`);
        assessmentTypeCodes = []; // reset the value
        if (assessmentTypeCodesResponse && assessmentTypeCodesResponse.length > 0) {
          assessmentTypeCodes = assessmentTypeCodesResponse;
        }
        log.info(`Loaded ${assessmentTypeCodes.length} assessment type codes.`);
      } catch (err) {
        log.error('Failed to load assessment type codes, will retry:', err);
        throw err;
      }
    }, {
      retries: 50
    });
  },
  getAssessmentTypeCodesJSON() {
    return assessmentTypeCodes;
  },
  async loadGradProgramCodes() {
    log.debug('Loading graduation program codes');
    await retry(async () => {
      try {
        const gradProgramCodesResponse = await getCommonServiceData(`${config.get('server:programAPIURL')}/api/v1/program/programs`);
        gradProgramCodes = []; // reset the value
        if (gradProgramCodesResponse && gradProgramCodesResponse.length > 0) {
          gradProgramCodes = gradProgramCodesResponse;
        }
        log.info(`Loaded ${gradProgramCodes.length} graduation program codes.`);
      } catch (err) {
        log.error('Failed to load graduation program codes, will retry:', err);
        throw err;
      }
    }, {
      retries: 50
    });
  },
  getGradProgramCodesJSON() {
    return gradProgramCodes;
  },
};

module.exports = cacheService;
