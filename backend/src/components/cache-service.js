'use strict';
const config = require('../config/index');
const log = require('../components/logger');
const {getApiCredentials} = require('../components/auth');
const {getData} = require('../components/utils');
const retry = require('async-retry');
const {generateSchoolObject, isSchoolActive} = require('./schoolUtils');
const {generateDistrictObject, isDistrictActive,generateAuthorityObject,isAuthorityActive} = require('./districtUtils');
const {LocalDate, DateTimeFormatter} = require('@js-joda/core');
const constants = require('../util/constants');

let schoolMap = new Map();
let schools = [];
let districts = [];
let districtsMap = new Map();
let districtsNumber_ID_Map = new Map();
let mincode_school_ID_Map = new Map();
let activeSchools = [];
let activeDistricts = [];

const cacheService = {

  async loadAllSchoolsToMap() {
    log.debug('Loading all schoolsMap');
    await retry(async () => {
      // if anything throws, we retry
      const data = await getApiCredentials(); // get the tokens first to make api calls.
      const schoolsResponse = await getData(data.accessToken, `${config.get('server:instituteAPIURL')}/api/v1/institute/school`);
      schools = []; // reset the value.
      schoolMap.clear();// reset the value.
      mincode_school_ID_Map.clear();
      activeSchools = [];
      if (schoolsResponse && schoolsResponse.length > 0) {
        for (const school of schoolsResponse) {
          const schoolObject = generateSchoolObject(school);
          schoolMap.set(schoolObject.schoolID, schoolObject);
          mincode_school_ID_Map.set(schoolObject.mincode, schoolObject.schoolID);
          schools.push(schoolObject);
          if (isSchoolActive(schoolObject)) {
            activeSchools.push(schoolObject);
          }
        }
      }
      log.info(`Loaded ${schoolMap.size} schools.`);
      log.info(`Loaded ${activeSchools.length} active schools.`);
    }, {
      retries: 10
    });
  },
  getAllSchoolsJSON() {
    return schools;
  },
  getSchoolBySchoolID(schoolID) {
    return schoolMap.get(schoolID);
  },
  getDistrictByDistrictID(districtID) {
    return districtsMap.get(districtID);
  },
  getAllActiveSchoolsJSON() {
    return activeSchools;
  },
 
  async loadAllDistrictsToMap() {
    log.debug('Loading all districtsMap');
    await retry(async () => {
      const data = await getApiCredentials();
      const districtsResponse = await getData(data.accessToken, `${config.get('server:instituteAPIURL')}/api/v1/institute/district`);
      // reset the value.
      districts = [];
      activeDistricts = [];
      districtsMap.clear();
      districtsNumber_ID_Map.clear();
      if (districtsResponse && districtsResponse.length > 0) {
        for (const district of districtsResponse) {
          const districtData = generateDistrictObject(district);
          districtsMap.set(district.districtId, districtData);
          districtsNumber_ID_Map.set(district.districtNumber, district.districtId);
          districts.push(districtData);
          if(isDistrictActive(districtData)){
            activeDistricts.push(districtData);
          }
        }
      }
      log.info(`loaded ${districtsMap.size} districts.`);
      log.info(`loaded ${activeDistricts.length} active districts.`);
    }, {
      retries: 50
    });

  },
  getAllDistrictsJSON() {
    return districts;
  },
  getAllActiveDistrictsJSON(){
    return activeDistricts;
  },
  getAuthorityJSONByAuthorityID(authorityID) {
    return authoritiesMap.get(authorityID);
  },
  getDistrictJSONByDistrictID(districtID) {
    return districtsMap.get(districtID);
  },
  getDistrictIdByDistrictNumber(districtNumber) {
    return districtsNumber_ID_Map.get(districtNumber);
  },
  getSchoolIdByMincode(mincode) {
    return mincode_school_ID_Map.get(mincode);
  },
  
};

module.exports = cacheService;
