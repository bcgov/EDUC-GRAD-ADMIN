"use strict";

function createMoreFiltersSearchCriteria(searchFilter) {
  let criteriaList = [];

  Object.keys(searchFilter).forEach(function (key) {
    let pValue = searchFilter[key];

    // SUPPORTED FILTERS (based on StudentCoursePaginationEntity fields)

    if (key === "studentStatus" && pValue) {
      criteriaList.push({
        key: "graduationStudentRecordEntity.studentStatus",
        operation: "eq",
        value: pValue,
        valueType: "STRING",
      });
    } else if (key === "schoolOfRecordSchoolID" && pValue) {
      criteriaList.push({
        key: "graduationStudentRecordEntity.schoolOfRecordId",
        operation: "eq",
        value: pValue,
        valueType: "UUID",
      });
    } else if (key === "grade" && pValue) {
      criteriaList.push({
        key: "graduationStudentRecordEntity.studentGrade",
        operation: "eq",
        value: pValue,
        valueType: "STRING",
      });
    } else if (key === "courseSessionFrom" && pValue) {
      criteriaList.push({
        key: "courseSession",
        operation: "gte",
        value: pValue.replace("-", ""), // Convert YYYY-MM to YYYYMM
        valueType: "STRING",
      });
    } else if (key === "courseSessionTo" && pValue) {
      criteriaList.push({
        key: "courseSession",
        operation: "lte",
        value: pValue.replace("-", ""), // Convert YYYY-MM to YYYYMM
        valueType: "STRING",
      });
    } else if (key === "equivalencyChallenge" && pValue) {
      criteriaList.push({
        key: "equivOrChallenge",
        operation: "eq",
        value: pValue,
        valueType: "STRING",
      });
    } else if (key === "associatedExam" && pValue) {
      // Check if studentExamId is not null for "yes", is null for "no"
      if (pValue === "yes") {
        criteriaList.push({
          key: "studentExamId",
          operation: "not_null",
          value: "",
          valueType: "UUID",
        });
      } else {
        criteriaList.push({
          key: "studentExamId",
          operation: "is_null",
          value: "",
          valueType: "UUID",
        });
      }
    }

    // DISABLED FILTERS (fields not available in StudentCoursePaginationEntity):
    // TODO: Re-enable these filters when entity structure is updated

    // } else if (key === "districtOfRecord" && pValue) {
    //   criteriaList.push({
    //     key: key,
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "STRING",
    //   });
    // } else if (key === "schoolAtGraduationSchoolID" && pValue) {
    //   criteriaList.push({
    //     key: "schoolAtGraduation",
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "UUID",
    //   });
    // } else if (key === "program" && pValue) {
    //   criteriaList.push({
    //     key: "programCode",
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "STRING",
    //   });
    // } else if (key === "programComplete" && pValue) {
    //   criteriaList.push({
    //     key: key,
    //     operation: "eq",
    //     value: pValue === "yes" ? "true" : "false",
    //     valueType: "BOOLEAN",
    //   });
    // } else if (key === "completionDateFrom" && pValue) {
    //   criteriaList.push({
    //     key: "completionDate",
    //     operation: "gte",
    //     value: pValue + "-01", // Add day to make it a full date
    //     valueType: "DATE",
    //   });
    // } else if (key === "completionDateTo" && pValue) {
    //   // Get last day of the month
    //   const dateParts = pValue.split("-");
    //   const year = parseInt(dateParts[0]);
    //   const month = parseInt(dateParts[1]);
    //   const lastDay = new Date(year, month, 0).getDate();
    //   criteriaList.push({
    //     key: "completionDate",
    //     operation: "lte",
    //     value: pValue + "-" + lastDay,
    //     valueType: "DATE",
    //   });
    // } else if (key === "courseCode" && pValue) {
    //   criteriaList.push({
    //     key: key,
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "STRING",
    //   });
    // } else if (key === "courseLevel" && pValue) {
    //   criteriaList.push({
    //     key: key,
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "STRING",
    //   });
    // } else if (key === "finalLetterGrade" && pValue) {
    //   criteriaList.push({
    //     key: "hasFinalLetterGrade",
    //     operation: "eq",
    //     value: pValue === "yes" ? "true" : "false",
    //     valueType: "BOOLEAN",
    //   });
    // } else if (key === "fineArtsAppliedSkill" && pValue) {
    //   criteriaList.push({
    //     key: key,
    //     operation: "eq",
    //     value: pValue,
    //     valueType: "STRING",
    //   });
    // }
  });

  if (criteriaList.length === 0) {
    return [];
  }

  return [{
    condition: "AND",
    searchCriteriaList: criteriaList
  }];
}

module.exports = {
  createMoreFiltersSearchCriteria,
};

