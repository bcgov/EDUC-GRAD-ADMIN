'use strict';
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('./constants/filter-operations');

function createMoreFiltersSearchCriteria(searchFilter = []) {
  let searchCriteriaList = [];

  for (const [key, value] of Object.entries(searchFilter)) {
    if (key === 'transmissionMode' && value) {
      searchCriteriaList.push({ 
        key: 'transmissionMode', 
        value: value.toString(), 
        operation: FILTER_OPERATION.STARTS_WITH_IGNORE_CASE, 
        valueType: VALUE_TYPE.STRING, 
        condition: CONDITION.AND 
      });
    }

    if (key === 'psiCode' && value) {
      searchCriteriaList.push({ 
        key: 'psiCode', 
        value: value.toString(), 
        operation: FILTER_OPERATION.STARTS_WITH_IGNORE_CASE, 
        valueType: VALUE_TYPE.STRING, 
        condition: CONDITION.AND 
      });
    }

    if (key === 'psiName' && value) {
      searchCriteriaList.push({ 
        key: 'psiName', 
        value: value.toString(), 
        operation: FILTER_OPERATION.CONTAINS_IGNORE_CASE, 
        valueType: VALUE_TYPE.STRING, 
        condition: CONDITION.AND 
      });
    }

    if (key === 'cslCode' && value) {
      searchCriteriaList.push({ 
        key: 'cslCode', 
        value: value.toString(), 
        operation: FILTER_OPERATION.STARTS_WITH_IGNORE_CASE, 
        valueType: VALUE_TYPE.STRING, 
        condition: CONDITION.AND 
      });
    }

    if (key === 'openFlag' && value) {
      searchCriteriaList.push({ 
        key: 'openFlag', 
        value: value.toString(), 
        operation: FILTER_OPERATION.EQUAL, 
        valueType: VALUE_TYPE.STRING, 
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
  createMoreFiltersSearchCriteria
};
