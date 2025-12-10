"use strict";
const { FILTER_OPERATION, VALUE_TYPE, CONDITION} = require('../constants/filter-operations');

function createMoreFiltersSearchCriteria(searchFilter) {
  let searchCriteriaList = [];

  Object.keys(searchFilter).forEach(function (key) {
    let pValue = searchFilter[key];

    if (key === "studentStatus" && pValue) {
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.studentStatus",
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "schoolOfRecordSchoolID" && pValue) {
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.schoolOfRecordId",
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === "grade" && pValue) {
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.studentGrade",
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "courseSessionFrom" && pValue) {
      searchCriteriaList.push({
        key: "courseSession",
        operation: FILTER_OPERATION.GREATER_THAN_OR_EQUAL_TO,
        value: pValue.replace("-", ""),
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "courseSessionTo" && pValue) {
      searchCriteriaList.push({
        key: "courseSession",
        operation: FILTER_OPERATION.LESS_THAN_OR_EQUAL_TO,
        value: pValue.replace("-", ""),
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "equivalencyChallenge" && pValue) {
      let codeValue = "";
      if (pValue === "equivalency") {
        codeValue = "E";
      } else if (pValue === "challenge") {
        codeValue = "C";
      }
      searchCriteriaList.push({
        key: "equivOrChallenge",
        operation: FILTER_OPERATION.EQUAL,
        value: codeValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "schoolAtGraduationSchoolID" && pValue) {
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.schoolAtGraduationId",
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.UUID,
        condition: CONDITION.AND
      });
    } else if (key === "program" && pValue) {
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.program",
        operation: FILTER_OPERATION.EQUAL,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "finalLetterGrade" && pValue) {
      if (pValue === "yes") {
        const criteria = {
          key: "finalLetterGrade",
          operation: FILTER_OPERATION.NOT_EQUAL,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      } else {
        const criteria = {
          key: "finalLetterGrade",
          operation: FILTER_OPERATION.EQUAL,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      }
    } else if (key === "fineArtsAppliedSkill" && pValue) {
      let codeValue = "";
      if (pValue === "fineArts") {
        codeValue = "F";
      } else if (pValue === "appliedSkills") {
        codeValue = "A";
      } else if (pValue === "both") {
        codeValue = "B";
      }
      searchCriteriaList.push({
        key: "fineArtsAppliedSkillsCode",
        operation: FILTER_OPERATION.EQUAL,
        value: codeValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    }
  });


  /*
   // todo not working filters
   else if (key === "completionDateFrom" && pValue) {
      const dateObj = new Date(pValue + "T00:00:00");
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.programCompletionDate",
        operation: FILTER_OPERATION.GREATER_THAN_OR_EQUAL_TO,
        value: dateObj.getTime().toString(),
        valueType: VALUE_TYPE.LONG,
        condition: CONDITION.AND
      });
    } else if (key === "completionDateTo" && pValue) {
      const dateObj = new Date(pValue + "T23:59:59");
      searchCriteriaList.push({
        key: "graduationStudentRecordEntity.programCompletionDate",
        operation: FILTER_OPERATION.LESS_THAN_OR_EQUAL_TO,
        value: dateObj.getTime().toString(),
        valueType: VALUE_TYPE.LONG,
        condition: CONDITION.AND
      });
    }  else if (key === "associatedExam" && pValue) {
      if (pValue === "yes") {
        const criteria = {
          key: "studentExamId",
          operation: FILTER_OPERATION.NOT_EQUAL,
          valueType: VALUE_TYPE.UUID,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      } else {
        const criteria = {
          key: "studentExamId",
          operation: FILTER_OPERATION.EQUAL,
          valueType: VALUE_TYPE.UUID,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      }  else if (key === "programComplete" && pValue) {
      if (pValue === "yes") {
        const criteria = {
          key: "graduationStudentRecordEntity.programCompletionDate",
          operation: FILTER_OPERATION.NOT_EQUAL,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      } else {
        const criteria = {
          key: "graduationStudentRecordEntity.programCompletionDate",
          operation: FILTER_OPERATION.EQUAL,
          valueType: VALUE_TYPE.STRING,
          condition: CONDITION.AND
        };
        searchCriteriaList.push(criteria);
      }
    }
    }




    todo - we have course id but not course code or level, we need to pull in course code/level cache to course id
     else if (key === "courseCode" && pValue) {
      searchCriteriaList.push({
        key: "courseCode",
        operation: FILTER_OPERATION.CONTAINS,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    } else if (key === "courseLevel" && pValue) {
      searchCriteriaList.push({
        key: "courseLevel",
        operation: FILTER_OPERATION.CONTAINS,
        value: pValue,
        valueType: VALUE_TYPE.STRING,
        condition: CONDITION.AND
      });
    }
   */

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

