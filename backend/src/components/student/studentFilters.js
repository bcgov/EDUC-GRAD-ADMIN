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
