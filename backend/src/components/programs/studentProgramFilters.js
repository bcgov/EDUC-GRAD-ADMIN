'use strict';
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('../constants/filter-operations');

function createMoreFiltersSearchCriteria(searchFilter) {
  let searchCriteriaList = [];

  Object.keys(searchFilter).forEach(function (key) {
    let pValue = searchFilter[key];

    if (key === 'studentStatus' && pValue) {
      searchCriteriaList.push({
        key: 'studentStatus',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === 'program' && pValue) {
      searchCriteriaList.push({
        key: 'program',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === 'grade' && pValue) {
      searchCriteriaList.push({
        key: 'studentGrade',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === 'programComplete' && pValue) {
      if (pValue === 'yes') {
        searchCriteriaList.push({
          key: 'programCompletionDate',
          operation: FILTER_OPERATION.NOT_EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      } else {
        searchCriteriaList.push({
          key: 'programCompletionDate',
          operation: FILTER_OPERATION.EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      }
    } else if (key === 'schoolAtGraduationSchoolID' && pValue) {
      searchCriteriaList.push({
        key: 'schoolAtGraduationId',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === 'schoolOfRecordSchoolID' && pValue) {
      searchCriteriaList.push({
        key: 'schoolOfRecordId',
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === 'districtOfRecord' && pValue) {
      searchCriteriaList.push({
        key: 'schoolOfRecordId',
        operation: FILTER_OPERATION.IN,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === 'recalculateGradStatus' && pValue) {
      if (pValue === 'Y') {
        searchCriteriaList.push({
          key: 'recalculateGradStatus',
          operation: FILTER_OPERATION.EQUAL,
          value: 'Y',
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      } else if (pValue === 'N') {
        searchCriteriaList.push({
          key: 'recalculateGradStatus',
          operation: FILTER_OPERATION.EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      }
    } else if (key === 'recalculateProjectedGrad' && pValue) {
      if (pValue === 'Y') {
        searchCriteriaList.push({
          key: 'recalculateProjectedGrad',
          operation: FILTER_OPERATION.EQUAL,
          value: 'Y',
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      } else if (pValue === 'N') {
        searchCriteriaList.push({
          key: 'recalculateProjectedGrad',
          operation: FILTER_OPERATION.EQUAL,
          value: null,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        });
      }
    }
  });

  if (searchFilter.completionDateFrom || searchFilter.completionDateTo) {
    const startDate = searchFilter.completionDateFrom ? `${searchFilter.completionDateFrom}T00:00:00` : '';
    const endDate = searchFilter.completionDateTo ? `${searchFilter.completionDateTo}T23:59:59` : '';

    searchCriteriaList.push({
      key: 'programCompletionDate',
      operation: FILTER_OPERATION.DATE_RANGE,
      value: `${startDate},${endDate}`,
      valueType: VALUE_TYPE.DATE_TIME,
      condition: CONDITION.AND
    });
  }

  if (searchFilter.adultStartDateFrom || searchFilter.adultStartDateTo) {
    const startDate = searchFilter.adultStartDateFrom ? `${searchFilter.adultStartDateFrom}T00:00:00` : '';
    const endDate = searchFilter.adultStartDateTo ? `${searchFilter.adultStartDateTo}T23:59:59` : '';

    searchCriteriaList.push({
      key: 'adultStartDate',
      operation: FILTER_OPERATION.DATE_RANGE,
      value: `${startDate},${endDate}`,
      valueType: VALUE_TYPE.DATE_TIME,
      condition: CONDITION.AND
    });
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

