const { errorResponse, getData } = require("../components/utils");
const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");

async function getGradProgramRules(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:programAPIURL"
    )}/api/v1/program/allprogramrules`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getGradProgramRulesByCode(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:programAPIURL"
    )}/api/v1/program/programrules?programCode=${req.params?.programCode}`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getGradProgramByCode(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:programAPIURL"
    )}/api/v1/program/programs/${req.params?.programCode}`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getOptionalProgramRules(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:programAPIURL"
    )}/api/v1/program/alloptionalprogramrules`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getAlgorithmRules(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentGraduationAPIURL"
    )}/api/v1/studentgraduation/algo/algorithm-rules`;
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
  getGradProgramRules,
  getGradProgramRulesByCode,
  getGradProgramByCode,
  getOptionalProgramRules,
  getAlgorithmRules,
};
