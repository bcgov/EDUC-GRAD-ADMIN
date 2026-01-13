"use strict";
const {
  logApiError,
  errorResponse
} = require("./utils");
const HttpStatus = require("http-status-codes");
const utils = require("./utils");
const cacheService = require("./cache-service");
const log = require("./logger");

const config = require("../config");
const API_BASE_ROUTE = "/api/v1/scholarships";
const auth = require("./auth");

async function getStudentAddress(req, res) {
  try {
    const token = auth.getBackendToken(req);
    const data = await utils.getData(
      token,
      `${config.get("server:scholarshipAPIURL")+ API_BASE_ROUTE
      }/${req.params.studentID}/address`,
      req.session?.correlationID
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e?.status === 404) {
      res.status(HttpStatus.OK).json(null);
    } else {
      await logApiError(e, "Error getting student address");
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
    }
  }
}

async function updateStudentAddress(req, res) {
try {
    const token = auth.getBackendToken(req);
    let payload = req.body;
    payload.updateDate= null;
    payload.createDate= null;
    payload.updateUser= utils.getUser(req).idir_username;

    const data = await utils.putData(
      token,
      `${config.get("server:scholarshipAPIURL")+ API_BASE_ROUTE
      }/${req.params.studentID}/address/${req.params.studentAddressID}`,
      payload,
      req.session?.correlationID
    );
    return res.status(200).json(data);
  } catch (e) {
      await logApiError(e, "Error updating student address");
      if (e.data.message) {
        return errorResponse(res, e.data.message, e.status);
      } else {
        return errorResponse(res);
      }
  }
}

async function getCitizenshipCodes(req, res) {
  try {
    const codes = cacheService.getCitizenshipCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getCitizenshipCodes', 'Error occurred while attempting to get cached citizenship codes.');
    return errorResponse(res);
  }
}

async function getProvinceCodes(req, res) {
  try {
    const codes = cacheService.getProvinceCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getProvinceCodes', 'Error occurred while attempting to get cached province codes.');
    return errorResponse(res);
  }
}

module.exports = {
  getStudentAddress,
  updateStudentAddress,
  getCitizenshipCodes,
  getProvinceCodes,
};
