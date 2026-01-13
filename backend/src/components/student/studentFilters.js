'use strict';
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('../constants/filter-operations');

function createFiltersSearchCriteria(searchFilter = []) {
  let searchCriteria = [];

  for (const [key, value] of Object.entries(searchFilter)) {

    if (key === 'studentStatus' && value) {
      searchCriteria.push({ key: 'studentStatus', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }
      
    if (key === 'givenName' && value) {
      searchCriteria.push({ key: 'givenName', value: value.toString(), operation: FILTER_OPERATION.CONTAINS_IGNORE_CASE, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'surName' && value) {
      searchCriteria.push({ key: 'surName', value: value.toString(), operation: FILTER_OPERATION.CONTAINS_IGNORE_CASE, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'pen' && value) {
      searchCriteria.push({ key: 'pen', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'genderCode' && value) {
      searchCriteria.push({ key: 'genderCode', value: value.toString(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalLastName' && value) {
      searchCriteria.push({ key: 'legalLastName', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalLastNameWild' && value) {
      searchCriteria.push({ key: 'legalLastName', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.CONTAINS, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalFirstName' && value) {
      searchCriteria.push({ key: 'legalFirstName', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalFirstNameWild' && value) {
      searchCriteria.push({ key: 'legalFirstName', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.CONTAINS, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalMiddleNames' && value) {
      searchCriteria.push({ key: 'legalMiddleNames', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.EQUAL, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'legalMiddleNamesWild' && value) {
      searchCriteria.push({ key: 'legalMiddleNames', value: value.toString().toUpperCase(), operation: FILTER_OPERATION.CONTAINS, valueType: VALUE_TYPE.STRING, condition: CONDITION.AND });
    }

    if (key === 'dobRange' && value) {
      const [start, end] = value.split(',').map(s => s.trim());
      searchCriteria.push(
        { key: 'dob',
          operation: FILTER_OPERATION.DATE_RANGE,
          value: `${start}T00:00:00,${end}T23:59:59`.toUpperCase(),
          valueType: VALUE_TYPE.DATE,
          condition: CONDITION.AND
        });
    }

    if (key === 'dob' && value) {
      const dobRange = `${value}T00:00:00,${value}T23:59:59`;
      searchCriteria.push(
        { key: 'dob',
          operation: FILTER_OPERATION.DATE_RANGE,
          value: dobRange.toUpperCase(),
          valueType: VALUE_TYPE.DATE,
          condition: CONDITION.AND 
        });
    }

  }
  const search = [];
  if (searchCriteria.length > 0) {
    search.push({
      condition: CONDITION.AND,
      searchCriteriaList: searchCriteria
    });
  }
  return search;
}

module.exports = {
  createFiltersSearchCriteria
};
