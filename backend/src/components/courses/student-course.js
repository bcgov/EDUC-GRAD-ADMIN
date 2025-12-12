"use strict";
const {
  logApiError,
  getCommonServiceData,
  errorResponse,
} = require("../utils");
const HttpStatus = require("http-status-codes");
const utils = require("../utils");
const config = require("../../config");
const { createMoreFiltersSearchCriteria } = require("../courses/studentCourseFilters");
const API_BASE_ROUTE = "/api/v1/student";
const auth = require("../auth");

async function getStudentCoursePaginated(req, res) {
  try {
    let searchArray = [];
    if (req.query?.searchParams) {
      searchArray = createMoreFiltersSearchCriteria(
        req.query.searchParams
      );
    }
    const params = {
      params: {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sort: JSON.stringify(req.query.sort),
        searchCriteriaList: JSON.stringify(searchArray),
      },
    };
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAPIURL") + API_BASE_ROUTE
      }/grad/student/course/search/pagination`,
      params
    );
    if (req?.query?.returnKey) {
      let result = data?.content.map(
        (student) => student[req?.query?.returnKey]
      );
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(200).json(data);
  } catch (e) {
    await logApiError(e, "Error getting student course paginated list");
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getCourseStudentSearchReport(req, res) {
  try {
    let searchArray = [];
    if (req.query?.searchParams) {
      searchArray = createMoreFiltersSearchCriteria(
        req.query.searchParams
      );
    }
    const params = {
      params: {
        searchCriteriaList: JSON.stringify(searchArray),
      },
    };
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAPIURL") + API_BASE_ROUTE
      }/report/course-students/search/download`,
      params
    );
    return res.status(200).json(data);
  } catch (e) {
    await logApiError(e, "Error getting student course search report");
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = {
  getStudentCoursePaginated,
  getCourseStudentSearchReport
};

