"use strict";
const {
  logApiError,
  getCommonServiceData,
  errorResponse, getCommonServiceStream,
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
    const search = [];
    if (req.query?.searchParams) {
      const criteriaArray = createMoreFiltersSearchCriteria(req.query.searchParams);
      criteriaArray.forEach((criteria) => search.push(criteria));
    }

    const url =
        config.get('server:studentAPIURL') +
        API_BASE_ROUTE +
        '/report/course-students/search/download';

    const params = {
      params: {
        searchCriteriaList: JSON.stringify(search),
      },
    };

    const apiRes = await getCommonServiceStream(url, params);

    if (apiRes.headers['content-type']) {
      res.setHeader('Content-Type', apiRes.headers['content-type']);
    } else {
      res.setHeader('Content-Type', 'text/csv');
    }

    if (apiRes.headers['content-disposition']) {
      res.setHeader('Content-Disposition', apiRes.headers['content-disposition']);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename="download.csv"');
    }

    apiRes.data.on('error', async (err) => {
      await logApiError(err, 'Error streaming report');
      if (!res.headersSent) {
        return errorResponse(res);
      }
      res.destroy(err);
    });

    apiRes.data.pipe(res);
  } catch (e) {
    await logApiError(e, 'Error getting report');
    if (!res.headersSent) {
      if (e.data?.message) {
        return errorResponse(res, e.data.message, e.status);
      }
      return errorResponse(res);
    }
    res.destroy(e);
  }
}

module.exports = {
  getStudentCoursePaginated,
  getCourseStudentSearchReport
};

