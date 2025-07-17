'use strict';
const { logApiError, getCommonServiceData, errorResponse, cachedApiCall } = require('../utils');
const HttpStatus = require('http-status-codes');
const utils = require('../utils');
const config = require('../../config');
const { createMoreFiltersSearchCriteria } = require('./studentFilters');
const API_BASE_ROUTE = '/api/v1/student-assessment';

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
  try {
    const userInfo = utils.getUser(req);
    const payload = {
      ...req.body,
      updateUser: userInfo.idir_username,
      updateDate: null,
      createDate: null
    };
    const result = await utils.postData(`${config.get('server:studentAssessmentAPIURL')}`, payload);
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
  if (req.params.studentAssessmentId !== req.body.studentAssessmentId) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'The studentAssessmentId in the URL did not match the studentAssessmentId in the request body.'
    });
  }
  try {
    const userInfo = utils.getUser(req);
    const payload = {
      ...req.body,
      updateUser: userInfo.idir_username,
      updateDate: null,
      createDate: null
    };
    const result = await utils.putData(`${config.get('server:studentAssessmentAPIURL')}/${req.params.studentAssessmentId}`, payload, utils.getUser(req).idir_username);
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
    const result = await utils.deleteData(`${config.get('server:studentAssessmentAPIURL')}/${req.params.studentAssessmentId}`);
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

module.exports = {
  getAssessmentTypeCodes,
  getStudentAssessmentById,
  getStudentAssessmentPaginated,
  updateStudentAssessmentById,
  postStudentAssessment,
  deleteStudentAssessmentByID
};
