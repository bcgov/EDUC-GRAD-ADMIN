'use strict';
const { logApiError, getCommonServiceData, errorResponse, cachedApiCall } = require('../utils');
const HttpStatus = require('http-status-codes');
const utils = require('../utils');
const config = require('../../config');
const { createMoreFiltersSearchCriteria } = require('./studentFilters');
const API_BASE_ROUTE = '/api/v1/student-assessment';
const auth = require('../auth');

async function getAssessmentTypeCodes(req, res) {
  try {
    let data = await cachedApiCall('assessment-type-codes', `${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/assessment-types`);
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, 'Error getting student assessment type codes');
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
    }
  }
}

async function getProvincialSpecialCaseCodes(req, res) {
  try {
    let data = await cachedApiCall('provincial-special-case-codes', `${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/assessment-specialcase-types`);
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, 'Error getting provincial special case codes');
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
    let data = await getCommonServiceData(`${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/student/${req.params.studentAssessmentId}`);
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, 'Error getting student assessment');
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
      let criteriaArray = createMoreFiltersSearchCriteria(req.query.searchParams);
      criteriaArray.forEach(criteria => {
        search.push(criteria);
      });
    }
    const params = {
      params: {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sort: JSON.stringify(req.query.sort),
        searchCriteriaList: JSON.stringify(search),
      }
    };
    let data =  await getCommonServiceData(`${config.get('server:studentAssessmentAPIURL')+ API_BASE_ROUTE}/student/paginated`, params);
    if (req?.query?.returnKey) {
      let result = data?.content.map((student) => student[req?.query?.returnKey]);
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(200).json(data);
  } catch (e) {
    await logApiError(e, 'Error getting student assessment paginated list');
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function postStudentAssessment(req, res){
  if (req.body.assessmentStudentID) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'The studentAssessmentId must be null.'
    });
  }
  try {
    const userName = utils.getUser(req).idir_username;
    const payload = {
      ...req.body,
      updateDate: null,
      createDate: null
    };
    const token = auth.getBackendToken(req);
    const student = await utils.getData(token, `${config.get('server:studentAPIURL')}/api/v1/student/grad/${req.body?.studentID}`, req.session?.correlationID);

    payload.surname = student.legalLastName;
    payload.givenName = student.legalFirstName;
    payload.schoolOfRecordSchoolID = student.schoolOfRecordId;
    payload.pen = student.pen;

    const result = await utils.postCommonServiceData(`${config.get('server:studentAssessmentAPIURL')+ API_BASE_ROUTE}/student`, payload, userName);
    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    await logApiError(e, 'postStudentAssessment', 'Error occurred while attempting to create the student assessment.');
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function updateStudentAssessmentById(req, res) {
  if (req.params.studentAssessmentId !== req.body.assessmentStudentID) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'The studentAssessmentId in the URL did not match the studentAssessmentId in the request body.'
    });
  }
  try {
    const userName = utils.getUser(req).idir_username;
    const payload = {
      ...req.body,
      updateDate: null,
      createDate: null
    };

    const result = await utils.putCommonServiceData(
      `${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/student/${req.params.studentAssessmentId}`,
      payload,
      userName);

    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    logApiError(e, 'updateStudentAssessmentById', 'Error occurred while attempting to save the changes to the student assessment registration.');
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function deleteStudentAssessmentByID(req, res) {
  try {
    const result = await utils.postCommonServiceData(`${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/student/delete-students`, [req.params.studentAssessmentId]);
    return res.status(HttpStatus.OK).json(result);
  } catch (e) {
    logApiError(e, 'deleteStudentAssessmentById', 'Error occurred while attempting to delete the student assessment.');
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getAllAssessmentSessions(req, res) {
  try {
    const url = `${config.get('server:studentAssessmentAPIURL') + API_BASE_ROUTE}/sessions`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    logApiError(e, 'getAssessmentSessions', 'Error occurred while attempting to GET assessment sessions.');
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = {
  getAssessmentTypeCodes,
  getStudentAssessmentById,
  getStudentAssessmentPaginated,
  updateStudentAssessmentById,
  postStudentAssessment,
  deleteStudentAssessmentByID,
  getAllAssessmentSessions,
  getProvincialSpecialCaseCodes
};
