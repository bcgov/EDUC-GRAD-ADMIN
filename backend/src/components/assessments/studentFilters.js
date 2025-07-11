'use strict';
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('../constants/filter-operations');

function createMoreFiltersSearchCriteria(searchFilter = []) {
  let searchCriteriaList = [];

  for (const [key, value] of Object.entries(searchFilter)) {
    //let pValue = filter ? filter.map(filter => filter.value) : null;
    
    //Default Filter Begin
    if (key === 'schoolYear' && value) {
      searchCriteriaList.push({ key: 'assessmentEntity.assessmentSessionEntity.schoolYear', value: value[0].replace('-', '/'), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }  
    //Default Filter End
    
    if (key === 'givenName' && value) {
      searchCriteriaList.push({ key: 'givenName', value: value.toString(), operation: FILTER_OPERATION.CONTAINS_IGNORE_CASE, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'surName' && value) {
      searchCriteriaList.push({ key: 'surName', value: value.toString(), operation: FILTER_OPERATION.CONTAINS_IGNORE_CASE, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'pen' && value) {
      searchCriteriaList.push({ key: 'pen', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'localID' && value) {
      searchCriteriaList.push({ key: 'localID', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'districtNameNumber' && value) {
      searchCriteriaList.push({ key: 'districtID', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.UUID, condition: CONDITION.AND });
    }

    if (key === 'schoolNameNumber' && value) {
      searchCriteriaList.push({ key: 'schoolID', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.UUID, condition: CONDITION.AND });
    }

    if (key === 'studentId' && value) {
      searchCriteriaList.push({ key: 'studentID', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.UUID, condition: CONDITION.AND });
    }

    if (key === 'session' && value) {
      searchCriteriaList.push({ key: 'assessmentEntity.assessmentSessionEntity.sessionID', value: value.toString(), operation: FILTER_OPERATION.IN, valueType: VALUE_TYPE.UUID, condition: CONDITION.AND });
    }

    if (key === 'assessmentTypeCode' && value) {
      searchCriteriaList.push({ key: 'assessmentEntity.assessmentTypeCode', value: value.toString(), operation: FILTER_OPERATION.IN, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }
    
    if (key === 'specialCaseCode' && value) {
      searchCriteriaList.push({ key: 'provincialSpecialCaseCode', value: value.toString(), operation: FILTER_OPERATION.IN, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'proficiencyScore' && value) {
      if(JSON.parse(value) === true) {
        searchCriteriaList.push({ key: 'proficiencyScore', value: 0, operation: FILTER_OPERATION.NOT_EQUAL, valueType: VALUE_TYPE.INTEGER, condition: CONDITION.AND });        
      } else {
        searchCriteriaList.push({ key: 'proficiencyScore', value:0, operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.INTEGER, condition: CONDITION.AND });        
      }     
    }

    if (key === 'proficiencyScoreValue' && value) {
      searchCriteriaList.push({ key: 'proficiencyScore', value: value.toString(), operation: FILTER_OPERATION.IN, valueType: VALUE_TYPE.INTEGER, condition: CONDITION.AND });
    }

  }
  const search = [];
  if (searchCriteriaList.length > 0) {
    search.push({
      condition: CONDITION.AND,
      searchCriteriaList: searchCriteriaList
    });
  }
  return search;
}

module.exports = {
  createMoreFiltersSearchCriteria
};
