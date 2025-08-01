const { errorResponse, getData } = require("../components/utils");
const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");

async function getStudentStatusCodes(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentstatus`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data); //idk about this, do we always want to return a 200?
  } catch (e) {
    log.error(
      e,
      "getStudentStatusCodes",
      "Error occurred while attempting to get student status codes"
    );
    if (e.data.message) {
      return response(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getHistoryActivityCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/historyactivity`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentGradeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/grade-codes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getFineArtsAppliedSkillsCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/fineArtsAppliedSkillsCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getEquivalentOrChallengeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/equivalentOrChallengeCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getExamSpecialCaseCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/examSpecialCaseCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = {
  getStudentStatusCodes,
  getHistoryActivityCodes,
  getStudentGradeCodes,
  getFineArtsAppliedSkillsCodes,
  getEquivalentOrChallengeCodes,
  getExamSpecialCaseCodes,
};
