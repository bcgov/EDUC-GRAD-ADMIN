const { errorResponse, getData } = require("../components/utils");
const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");

async function getSchoolReport(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v2/graduationreports/schoolreports/search?schoolOfRecordId=${
      req.params?.schoolID
    }`;
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

async function getDistrictReport(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v2/graduationreports/district-report/search?districtId=${
      req.params?.districtID
    }`;
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
module.exports = { getSchoolReport, getDistrictReport};
