"use strict";
const {
  logApiError,
  getCommonServiceData,
  errorResponse,
  cachedApiCall,
  getCommonServiceStream
} = require("../utils");
const HttpStatus = require("http-status-codes");
const utils = require("../utils");
const cacheService = require("../cache-service");
const log = require("../logger");

const config = require("../../config");
const { createMoreFiltersSearchCriteria } = require("./studentFilters");
const {
  STUDENT_STATUS_CODE_MAP,
} = require("../constants/student-status-codes");
const API_BASE_ROUTE = "/api/v1/student-assessment";
const auth = require("../auth");

async function getAssessmentTypeCodes(req, res) {
  try {
    const codes = cacheService.getAssessmentTypeCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getAssessmentTypeCodes', 'Error occurred while attempting to get cached assessment type codes.');
    return errorResponse(res);
  }
}

async function getProvincialSpecialCaseCodes(req, res) {
  try {
    let data = await cachedApiCall(
      "provincial-special-case-codes",
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/assessment-specialcase-types`
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, "Error getting provincial special case codes");
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
    }
  }
}

async function getStudentAssessmentById(req, res) {
  try {
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student/${req.params.studentAssessmentId}`
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, "Error getting student assessment");
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
    }
  }
}

async function getStudentAssessmentByIdAndAssessmentId(req, res) {
  try {
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student/${req.params.studentAssessmentId}/assessment/${
        req.params.assessmentId
      }`
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, "Error getting student assessment");
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
    }
  }
}

async function getStudentAssessmentPaginated(req, res) {
  try {
    const search = [];
    if (req.query?.searchParams) {
      let criteriaArray = createMoreFiltersSearchCriteria(
        req.query.searchParams
      );
      criteriaArray.forEach((criteria) => {
        search.push(criteria);
      });
    }
    const params = {
      params: {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sort: JSON.stringify(req.query.sort),
        searchCriteriaList: JSON.stringify(search),
      },
    };
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student/paginated`,
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
    await logApiError(e, "Error getting student assessment paginated list");
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentAssessmentHistoryPaginated(req, res) {
  try {
    const search = [];
    if (req.query?.searchParams) {
      let criteriaArray = createMoreFiltersSearchCriteria(
        req.query.searchParams
      );
      criteriaArray.forEach((criteria) => {
        search.push(criteria);
      });
    }
    const params = {
      params: {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sort: JSON.stringify(req.query.sort),
        searchCriteriaList: JSON.stringify(search),
      },
    };
    let data = await getCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student-history/paginated`,
      params
    );

    if (data?.content) {
      data.content.forEach((assessment) => {
        assessment.historyDate = assessment.createDate
          .substring(0, 19)
          .replace("T", " ");
      });
    }

    if (req?.query?.returnKey) {
      let result = data?.content.map(
        (student) => student[req?.query?.returnKey]
      );
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(200).json(data);
  } catch (e) {
    await logApiError(
      e,
      "Error getting student assessment history paginated list: " + e.message
    );
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function postStudentAssessment(req, res) {
  try {
    const userName = utils.getUser(req).idir_username;
    const payload = {
      ...req.body,
      updateDate: null,
      createDate: null,
    };
    const token = auth.getBackendToken(req);
    const student = await utils.getData(
      token,
      `${config.get("server:studentAPIURL")}/api/v1/student/stdid/${
        req.body?.studentID
      }`,
      req.session?.correlationID
    );

    payload.surname = student.legalLastName;
    payload.givenName = student.legalFirstName;
    payload.schoolOfRecordSchoolID = student.schoolOfRecordId;
    payload.pen = student.pen;
    payload.studentStatusCode = STUDENT_STATUS_CODE_MAP[student.statusCode];

    const allowRuleOverride = req.query.allowRuleOverride === "true";
    const defaultParams = { source: "GRAD" };
    const params = allowRuleOverride
      ? { ...defaultParams, allowRuleOverride: true }
      : defaultParams;
    const result = await utils.postCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student`,
      payload,
      userName,
      { params: params }
    );
    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    await logApiError(
      e,
      "postStudentAssessment",
      "Error occurred while attempting to create the student assessment."
    );
    if (e.data?.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function updateStudentAssessmentById(req, res) {
  if (req.params.studentAssessmentId !== req.body.assessmentStudentID) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message:
        "The studentAssessmentId in the URL did not match the studentAssessmentId in the request body.",
    });
  }
  try {
    const userName = utils.getUser(req).idir_username;
    const payload = {
      ...req.body,
      updateDate: null,
      createDate: null,
    };

    const result = await utils.putCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student/${req.params.studentAssessmentId}`,
      payload,
      userName,
      { params: { allowRuleOverride: true, source: "GRAD" } }
    );

    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    logApiError(
      e,
      "updateStudentAssessmentById",
      "Error occurred while attempting to save the changes to the student assessment registration."
    );
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function deleteStudentAssessmentByID(req, res) {
  try {
    const allowRuleOverride = req.query.allowRuleOverride === "true";
    const defaultParams = { source: "GRAD" };
    const params = allowRuleOverride
      ? { ...defaultParams, allowRuleOverride: true }
      : defaultParams;

    const result = await utils.postCommonServiceData(
      `${
        config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
      }/student/delete-students`,
      [req.params.studentAssessmentId],
      null,
      { params: params }
    );
    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    logApiError(
      e,
      "deleteStudentAssessmentById",
      "Error occurred while attempting to delete the student assessment."
    );
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getAllAssessmentSessions(req, res) {
  try {
    const url = `${
      config.get("server:studentAssessmentAPIURL") + API_BASE_ROUTE
    }/sessions`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    logApiError(
      e,
      "getAssessmentSessions",
      "Error occurred while attempting to GET assessment sessions."
    );
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function transferStudentAssessments(req, res) {
  try {
    const url = `${config.get("server:studentAssessmentAPIURL")}` + API_BASE_ROUTE + "/student/transfer";
    const response = await utils.postCommonServiceData(
      url,
      {
        targetStudentID: req.query?.targetStudentID,
        sourceStudentID: req.query?.sourceStudentID,
        studentAssessmentIDsToMove: req.body
      },
      utils.getUser(req).idir_username
    );
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error merging student assessments:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getAssessmentStudentSearchReport(req, res) {
  try {
    const search = [];
    if (req.query?.searchParams) {
      const criteriaArray = createMoreFiltersSearchCriteria(req.query.searchParams);
      criteriaArray.forEach((criteria) => search.push(criteria));
    }

    const url =
        config.get('server:studentAssessmentAPIURL') +
        API_BASE_ROUTE +
        '/report/assessment-students/search/download';

    const params = {
      params: {
        searchCriteriaList: JSON.stringify(search),
      },
    };

    const apiRes = await getCommonServiceStream(url, params, req);

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

    req.on('close', () => {
      if (!res.writableEnded) {
        apiRes.data.destroy();
      }
    });

    apiRes.data.on('error', async (err) => {
      await logApiError(err, 'Error streaming report');
      if (!res.headersSent) {
        return errorResponse(res);
      }
      res.destroy(err);
    });

    res.on('error', (err) => {
      console.error('Error writing to client response:', err);
      apiRes.data.destroy();
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

async function mergeStudentAssessmentsByStudentID(req, res) {
  try {
    const url = `${config.get("server:studentAssessmentAPIURL")}/api/v1/student-assessment/student/merge`;
    const response = await utils.postCommonServiceData(
      url,
      {
        targetStudentID: req.query?.targetStudentID,
        sourceStudentID: req.query?.sourceStudentID,
        studentAssessmentIDsToMove: req.body
      },
      utils.getUser(req).idir_username
    );
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error merging student assessments:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function downloadAssessmentTypeCodesCSV(req, res) {
  try {
    const codes = cacheService.getAssessmentTypeCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No assessment type codes available' });
    }

    const csvHelpers = require('../codes-csv-helpers');

    const headers = [
      'Assessment Code',
      'Assessment Name',
      'Language',
      'Start Date',
      'End Date'
    ];

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.assessmentTypeCode),
      csvHelpers.escapeCSV(item.label),
      csvHelpers.escapeCSV(item.language),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `AssessmentCodes_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadAssessmentTypeCodesCSV', 'Error occurred while generating assessment type codes CSV.');
    return errorResponse(res);
  }
}

module.exports = {
  getAssessmentTypeCodes,
  downloadAssessmentTypeCodesCSV,
  getStudentAssessmentById,
  getStudentAssessmentPaginated,
  updateStudentAssessmentById,
  postStudentAssessment,
  deleteStudentAssessmentByID,
  getAllAssessmentSessions,
  getProvincialSpecialCaseCodes,
  getStudentAssessmentHistoryPaginated,
  getStudentAssessmentByIdAndAssessmentId,
  transferStudentAssessments,
  getAssessmentStudentSearchReport,
  mergeStudentAssessmentsByStudentID
};
