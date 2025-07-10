const {
  errorResponse,
  getData,
  getCommonServiceData,
  putData,
  formatQueryParamString,
} = require("./utils");
const config = require("../config/index");
const auth = require("./auth");

async function getInstituteSchoolsList(_req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/school`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteDistrictsList(_req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/district`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteSchool(req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/school/${req.params?.schoolID}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteDistrict(req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/district/${req.params?.districtID}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getPSISearch(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:gradTraxAPIURL"
    )}/api/v1/trax/psi/search${formatQueryParamString(req.query)}`;
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

async function getInstituteEventHistory(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:gradTraxAPIURL"
    )}/api/v1/trax/event/history/paginated?pageNumber=${
      req.query?.pageNumber
    }&pageSize=${req.query?.pageSize}&sort=${encodeURIComponent(
      JSON.stringify(req.query?.sort)
    )}&searchParams=${encodeURIComponent(
      JSON.stringify(req.query?.searchParams)
    )}`;
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

async function putInstituteEventHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:gradTraxAPIURL"
    )}/api/v1/trax/event/history`;
    const data = await putData(
      token,
      req.body,
      url,
      req.session?.correlationID
    );
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
  getInstituteSchoolsList,
  getInstituteDistrictsList,
  getInstituteSchool,
  getInstituteDistrict,
  getPSISearch,
  getInstituteEventHistory,
  putInstituteEventHistory,
};
