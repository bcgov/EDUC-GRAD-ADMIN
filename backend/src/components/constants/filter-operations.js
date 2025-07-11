const FILTER_OPERATION = Object.freeze(
  {
    EQUAL: 'eq',
    NOT_EQUAL: 'neq',
    GREATER_THAN: 'gt',
    GREATER_THAN_OR_EQUAL_TO: 'gte',
    LESS_THAN: 'lt',
    LESS_THAN_OR_EQUAL_TO: 'lte',
    IN: 'in',
    /**
       * Filter to return when none of the child records includes the values
       */
    NONE_IN: 'none_in',
    NOT_IN: 'nin',
    BETWEEN: 'btn',
    CONTAINS: 'like',
    CONTAINS_IGNORE_CASE: 'like_ignore_case',
    STARTS_WITH: 'starts_with',
    NOT_STARTS_WITH: 'not_starts_with',
    STARTS_WITH_IGNORE_CASE: 'starts_with_ignore_case',
    ENDS_WITH: 'ends_with',
    /**
     * In operation that does not include the DISTINCT condition
     */
    IN_NOT_DISTINCT: 'in_not_distinct'
  }
);
const CONDITION = Object.freeze(
  {
    AND: 'AND',
    OR: 'OR'
  }
);

const VALUE_TYPE = Object.freeze(
  {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    LONG: 'LONG',
    DATE: 'DATE',
    DATE_TIME: 'DATE_TIME',
    UUID: 'UUID',
    BOOLEAN: 'BOOLEAN'
  }
);

module.exports = {
  FILTER_OPERATION,
  CONDITION,
  VALUE_TYPE
};
