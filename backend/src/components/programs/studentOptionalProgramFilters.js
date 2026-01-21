'use strict';
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('../constants/filter-operations');

function createMoreFiltersSearchCriteria(searchFilter) {
  let searchCriteriaList = [];

  Object.keys(searchFilter).forEach(function (key) {
    let pValue = searchFilter[key];

    if (key === 'studentStatus' && pValue) {
      searchCriteriaList.push({
        key: 'graduationStudentRecordEntity.studentStatus',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === 'optionalProgram' && pValue) {
      // pValue can be a single ID or comma-separated list of IDs
      const ids = pValue.split(',').map(id => id.trim());

      if (ids.length === 1) {
        searchCriteriaList.push({
          key: 'optionalProgramID',
          operation: FILTER_OPERATION.EQUAL,
          value: ids[0],
          valueType: VALUE_TYPE.UUID,
          condition: CONDITION.AND
        });
      } else {
        searchCriteriaList.push({
          key: 'optionalProgramID',
          operation: FILTER_OPERATION.IN,
          value: pValue,
          valueType: VALUE_TYPE.UUID,
          condition: CONDITION.AND
        });
      }
    } else if (key === 'programComplete' && pValue) {
      if (pValue === 'yes') {
        searchCriteriaList.push({
          key: 'graduationStudentRecordEntity.programCompletionDate',
          operation: FILTER_OPERATION.NOT_EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      } else {
        searchCriteriaList.push({
          key: 'graduationStudentRecordEntity.programCompletionDate',
          operation: FILTER_OPERATION.EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      }
    } else if (key === 'schoolAtGraduationSchoolID' && pValue) {
      searchCriteriaList.push({
        key: 'graduationStudentRecordEntity.schoolAtGraduationId',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === 'schoolOfRecordSchoolID' && pValue) {
      searchCriteriaList.push({
        key: 'graduationStudentRecordEntity.schoolOfRecordId',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === 'districtOfRecord' && pValue) {
      searchCriteriaList.push({
        key: 'graduationStudentRecordEntity.schoolOfRecordId',
        operation: FILTER_OPERATION.IN,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    }
  });

  if (searchFilter.optionalProgramCompletionDateFrom || searchFilter.optionalProgramCompletionDateTo) {
    if (searchFilter.optionalProgramCompletionDateFrom && searchFilter.optionalProgramCompletionDateTo) {
      const startDate = `${searchFilter.optionalProgramCompletionDateFrom}T00:00:00`;
      const endDate = `${searchFilter.optionalProgramCompletionDateTo}T23:59:59`;

      searchCriteriaList.push({
        key: 'completionDate',
        operation: FILTER_OPERATION.DATE_RANGE,
        value: `${startDate},${endDate}`,
        valueType: VALUE_TYPE.DATE_TIME,
        condition: CONDITION.AND
      });
    }
    else if (searchFilter.optionalProgramCompletionDateFrom) {
      const exactDate = `${searchFilter.optionalProgramCompletionDateFrom}T00:00:00`;
      const endOfDay = `${searchFilter.optionalProgramCompletionDateFrom}T23:59:59`;

      searchCriteriaList.push({
        key: 'completionDate',
        operation: FILTER_OPERATION.DATE_RANGE,
        value: `${exactDate},${endOfDay}`,
        valueType: VALUE_TYPE.DATE_TIME,
        condition: CONDITION.AND
      });
    }
    else if (searchFilter.optionalProgramCompletionDateTo) {
      const exactDate = `${searchFilter.optionalProgramCompletionDateTo}T00:00:00`;
      const endOfDay = `${searchFilter.optionalProgramCompletionDateTo}T23:59:59`;

      searchCriteriaList.push({
        key: 'completionDate',
        operation: FILTER_OPERATION.DATE_RANGE,
        value: `${exactDate},${endOfDay}`,
        valueType: VALUE_TYPE.DATE_TIME,
        condition: CONDITION.AND
      });
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
  createMoreFiltersSearchCriteria,
};

