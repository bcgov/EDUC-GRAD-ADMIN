const {
  errorResponse,
  getData,
  getCommonServiceData,
  putData,
  formatQueryParamString,
} = require("./utils");
const config = require("../config/index");
const auth = require("./auth");
const log = require("../components/logger");

async function getInstituteSchoolsList(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get("server:gradTraxAPIURL")}/api/v2/trax/school`;
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

async function getInstituteDistrictsList(_req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/district`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteSchool(req, res) {
  const token = auth.getBackendToken(req);
  try {
    `${config.get("server:gradTraxAPIURL")}/api/v2/trax/school/${
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

async function getInstituteDistrict(req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/district/${req.params?.districtID}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getPSISearch(req, res) {
  const token = auth.getBackendToken(req);
  try {
    let data;
    if(config.get("frontendConfig").enableCRUD === 'true') {
      const url = `${config.get(
        "server:psiSelectionAPIURL"
      )}/api/v1/psi/search${formatQueryParamString(req.query)}`;
      data = await getCommonServiceData(url);
    } else {
      const url = `${config.get(
        "server:gradTraxAPIURL"
      )}/api/v1/trax/psi/search${formatQueryParamString(req.query)}`;
      data = await getData(token, url, req.session?.correlationID);
    }
    return res.status(200).json(data);
  } catch (e) {
    log.error(
      e,
      "getPSISearch",
      "Error occurred while attempting to get PSI search results"
    );
    if (e.data?.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteEventHistory(req, res) {
  const token = auth.getBackendToken(req);

  const sort =
    typeof req.query?.sort === "string"
      ? JSON.parse(req.query.sort)
      : req.query.sort;

  const searchParams =
    typeof req.query?.searchParams === "string"
      ? JSON.parse(req.query.searchParams)
      : req.query.searchParams;

  try {
    const url = `${config.get(
      "server:gradTraxAPIURL"
    )}/api/v1/trax/event/history/paginated?pageNumber=${
      req.query?.pageNumber
    }&pageSize=${req.query?.pageSize}&sort=${encodeURIComponent(
      JSON.stringify(sort)
    )}&searchParams=${encodeURIComponent(JSON.stringify(searchParams))}`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    log.error(
      e,
      "eventHistoryError",
      "Error occurred while attempting to get institute events"
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
      url,
      req.body,
      req.session?.correlationID
    );
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
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
