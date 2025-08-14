"use strict";

const axios = require("axios");
const config = require("../config/index");
const log = require("./logger");
const HttpStatus = require("http-status-codes");
const lodash = require("lodash");
const { ApiError } = require("./error");
const jsonwebtoken = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  LocalDateTime,
  DateTimeFormatter,
  LocalDate,
  DateTimeFormatterBuilder,
  ResolverStyle,
} = require("@js-joda/core");
const { Locale } = require("@js-joda/locale_en");
const auth = require("./auth");
const cache = require("memory-cache");
const fsStringify = require("fast-safe-stringify");
let memCache = new cache.Cache();

axios.interceptors.request.use((axiosRequestConfig) => {
  axiosRequestConfig.headers["X-Client-Name"] = "GRAD-ADMIN";
  axiosRequestConfig.headers["Request-Source"] = "grad-admin";
  return axiosRequestConfig;
});

async function getBackendServiceToken() {
  return await auth.getBackendServiceToken();
}

function getUsernameFromToken(token) {
  try {
    const decoded = jsonwebtoken.decode(token); // Use decode if you don't need verification
    return decoded?.idir_username || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

function getUser(req) {
  const thisSession = req.session;
  if (
    thisSession &&
    thisSession["passport"] &&
    thisSession["passport"].user &&
    thisSession["passport"].user.jwt
  ) {
    try {
      return jsonwebtoken.verify(
        thisSession["passport"].user.jwt,
        config.get("oidc:publicKey")
      );
    } catch (e) {
      log.error("error is from verify", e);
      return false;
    }
  } else {
    return false;
  }
}

function minify(obj, keys = ["documentData"]) {
  return lodash.transform(
    obj,
    (result, value, key) =>
      (result[key] =
        keys.includes(key) && lodash.isString(value)
          ? value.substring(0, 1) + " ..."
          : value)
  );
}

function getSessionUser(req) {
  log.verbose("getSessionUser", req.session);
  const session = req.session;
  return session && session.passport && session.passport.user;
}

function getAccessToken(req) {
  const user = getSessionUser(req);
  return user && user.jwt;
}

async function deleteData(token, url, data = null, correlationID) {
  try {
    const username = getUsernameFromToken(token);
    const delConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4(),
        "User-Name": username || "N/A",
      },
      ...(data && { data }),
    };

    log.info("delete Data Url", url);
    const response = await axios.delete(url, delConfig);
    log.info(`delete Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `delete Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `delete Data Response for url ${url}  :: is :: `,
      minify(response.data)
    );

    return response.data;
  } catch (e) {
    log.error("deleteData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Delete error" }, e);
  }
}

async function forwardGetReq(req, res, url) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "No access token",
      });
    }

    const params = {
      params: req.query,
    };

    log.info("forwardGetReq Url", url);
    const data = await getDataWithParams(
      accessToken,
      url,
      params,
      req.session?.correlationID
    );
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    log.error("forwardGetReq Error", e.stack);
    return res.status(e.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Forward Get error",
    });
  }
}

function addTokenToHeader(params, token) {
  if (params) {
    if (params.headers) {
      params.headers.Authorization = `Bearer ${token}`;
    } else {
      params.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
  } else {
    params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return params;
}

async function getCommonServiceData(url, params) {
  try {
    params = addTokenToHeader(params, await getBackendServiceToken());
    log.info("GET", url);
    const response = await axios.get(url, params);
    return response.data;
  } catch (e) {
    log.error(
      "getCommonServiceData Error",
      e.response ? e.response.status : e.message
    );
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Get error" }, e);
  }
}
async function putCommonServiceData(url, data, user) {
  try {
    const putDataConfig = addTokenToHeader(
      null,
      await getBackendServiceToken()
    );
    if (user && typeof user === "string") {
      data.updateUser = user;
    } else {
      data.updateUser = "GRAD";
    }
    log.info("PUT", url);
    log.debug("put Data Req", data);
    const response = await axios.put(url, data, putDataConfig);
    log.info(`put Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `put Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `put Data Response for url ${url}  :: is :: `,
      minify(response.data)
    );
    return response.data;
  } catch (e) {
    log.error("putData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Put error" }, e);
  }
}

async function postCommonServiceData(url, data, user) {
  try {
    const putDataConfig = addTokenToHeader(
      null,
      await getBackendServiceToken()
    );
    if (user && typeof user === "string") {
      data.updateUser = user;
      data.createUser = user;
    } else {
      data.updateUser = "GRAD";
      data.createUser = "GRAD";
    }
    log.info("POST", url);
    log.debug("post Data Req", data);
    const response = await axios.post(url, data, putDataConfig);
    log.info(`post Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `post Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `post Data Response for url ${url}  :: is :: `,
      minify(response.data)
    );
    return response.data;
  } catch (e) {
    log.error("postData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Post error" }, e);
  }
}

async function getData(token, url, correlationID) {
  const username = getUsernameFromToken(token);
  try {
    const getDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4(),
        "User-Name": username || "N/A",
      },
    };
    // log.info('get Data Url', url);
    const response = await axios.get(url, getDataConfig);
    // log.info(`get Data Status for url ${url} :: is :: `, response.status);
    // log.info(`get Data StatusText for url ${url}  :: is :: `, response.statusText);
    // log.verbose(`get Data Response for url ${url}  :: is :: `, minify(response.data));

    return response.data;
  } catch (e) {
    log.error("getData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Get error" }, e);
  }
}

async function getDataWithParams(token, url, params, correlationID) {
  try {
    const username = getUsernameFromToken(token);
    params.headers = {
      Authorization: `Bearer ${token}`,
      correlationID: correlationID || uuidv4(),
      "User-Name": username || "N/A",
    };

    log.info("get Data Url", url);
    const response = await axios.get(url, params);
    log.info(`get Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `get Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `get Data Response for url ${url}  :: is :: `,
      minify(response.data)
    );

    return response.data;
  } catch (e) {
    log.error(
      "getDataWithParams Error",
      e.response ? e.response.status : e.message
    );
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Get error" }, e);
  }
}

async function forwardPostReq(req, res, url) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "No session data",
      });
    }

    const data = await postData(
      accessToken,
      req.body,
      url,
      req.session?.correlationID
    );
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    log.error("forwardPostReq Error", e.stack);
    return res.status(e.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Forward Post error",
    });
  }
}

async function postData(token, url, data, correlationID) {
  try {
    const username = getUsernameFromToken(token);
    const postDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4(),
        "User-Name": username || "N/A",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    log.info("post Data Url", url);
    log.verbose("post Data Req", minify(data));
    if (data) {
      data.createUser = "GRAD";
      data.updateUser = "GRAD";
    }
    const response = await axios.post(url, data, postDataConfig);

    log.info(`post Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `post Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `post Data Response for url ${url}  :: is :: `,
      typeof response.data === "string" ? response.data : minify(response.data)
    );

    return response.data;
  } catch (e) {
    log.error("postData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let responseData;
    if (e?.response?.data) {
      responseData = e.response.data;
    } else {
      responseData = { message: `API POST error, on ${url}` };
    }
    throw new ApiError(status, responseData, e);
  }
}

async function putData(token, data, url, correlationID) {
  try {
    const username = getUsernameFromToken(token);
    const putDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4(),
        "User-Name": username || "N/A",
      },
    };

    log.info("put Data Url", url);
    log.verbose("put Data Req", data);

    const response = await axios.put(url, data, putDataConfig);

    log.info(`put Data Status for url ${url} :: is :: `, response.status);
    log.info(
      `put Data StatusText for url ${url}  :: is :: `,
      response.statusText
    );
    log.verbose(
      `put Data Response for url ${url}  :: is :: `,
      minify(response.data)
    );

    return response.data;
  } catch (e) {
    log.error("putData Error", e.response ? e.response.status : e.message);
    const status = e.response
      ? e.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, { message: "API Put error" }, e);
  }
}

function formatCommentTimestamp(time) {
  const timestamp = LocalDateTime.parse(time);
  return timestamp.format(
    DateTimeFormatter.ofPattern("yyyy-MM-dd h:mma").withLocale(Locale.CANADA)
  );
}

function getCodeTable(token, key, url, useCache = true) {
  try {
    let cacheContent = useCache && memCache.get(key);
    if (cacheContent) {
      return cacheContent;
    } else {
      const getDataConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      log.info("get Data Url", url);

      return axios
        .get(url, getDataConfig)
        .then((response) => {
          useCache && memCache.put(key, response.data);
          return response.data;
        })
        .catch((e) => {
          log.error(e, "getCodeTable", "Error during get on " + url);
          const status = e.response
            ? e.response.status
            : HttpStatus.INTERNAL_SERVER_ERROR;
          throw new ApiError(status, { message: "API get error" }, e);
        });
    }
  } catch (e) {
    throw new Error(`getCodeTable error, ${e}`);
  }
}
function getCodes(urlKey, cacheKey, extraPath, useCache = true) {
  return async function getCodesHandler(req, res) {
    try {
      const token = auth.getBackendToken(req);
      if (!token) {
        return unauthorizedError(res);
      }
      const url = config.get(urlKey);
      const codes = await getCodeTable(
        token,
        cacheKey,
        extraPath ? `${url}${extraPath}` : url,
        useCache
      );

      return res.status(HttpStatus.OK).json(codes);
    } catch (e) {
      log.error(
        e,
        "getCodes",
        `Error occurred while attempting to GET ${cacheKey}.`
      );
      return errorResponse(res);
    }
  };
}
function cacheMiddleware() {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        if (res.statusCode < 300 && res.statusCode >= 200) {
          memCache.put(key, body);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
}

function unauthorizedError(res) {
  return res.status(HttpStatus.UNAUTHORIZED).json({
    message: "No access token",
  });
}

function errorResponse(res, msg, code) {
  return res.status(code || HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: msg || "INTERNAL SERVER ERROR",
    code: code || HttpStatus.INTERNAL_SERVER_ERROR,
  });
}

async function logApiError(e, functionName, message) {
  if (e?.response?.status === 404) {
    log.info("Entity not found", e);
  } else if (e?.response?.data) {
    log.error(fsStringify(e.response.data));
  } else if (message) {
    log.error(message);
    log.error(functionName, " Error", JSON.stringify(e));
  } else {
    log.error(functionName, " Error", JSON.stringify(e));
  }
}

async function cachedApiCall(cacheKey, url, useCache = true) {
  if (useCache) {
    const cached = memCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  const params = addTokenToHeader(null, await getBackendServiceToken());
  const response = await axios.get(url, params);
  const data = response.data;

  if (useCache) {
    memCache.put(cacheKey, data);
  }
  return data;
}

function formatQueryParamString(queryParams) {
  return (
    "?" +
    Object.entries(queryParams) //convert queryParams json into js object
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&")
  );
}
function addCourseDetails(courseData, data) {
  const courseMap = new Map(
    courseData.map((course) => [course.courseID, course])
  );

  const studentCoursesWithDetails = data.map((studentCourse) => {
    const courseID = studentCourse.courseID;
    const relatedCourseId = studentCourse.relatedCourseId;

    const matchedCourse = courseMap.get(courseID);
    const matchedRelatedCourse = courseMap.get(relatedCourseId);

    return {
      ...studentCourse,
      courseDetails: matchedCourse || null,
      relatedCourseDetails: matchedRelatedCourse || null,
    };
  });
  return studentCoursesWithDetails;
}
/**
 * Extracts unique course IDs from an array of student course objects.
 * @param {Array<Object>} studentCourses The array of course objects returned from the student API.
 * @returns {Array<number>} An array of course IDs.
 */
const getCourseIDsPayload = (studentCourses) => {
  // If studentCourses is not an array, return an empty array
  if (!Array.isArray(studentCourses)) {
    return { courseIds: [] };
  }

  // Use flatMap to create a new, flattened array of course IDs
  const courseIds = studentCourses.flatMap((course) => {
    const ids = [];
    if (course.courseID) {
      ids.push(Number(course.courseID));
    }
    if (course.relatedCourseId) {
      ids.push(Number(course.relatedCourseId));
    }
    return ids;
  });

  // Return the payload object
  return { courseIds };
};
/**
 * Fetches detailed course information from the course API.
 * @param {string} token The authentication token.
 * @param {Object} courseIDsPayload The payload containing an array of course IDs.
 * @param {string} correlationID An ID for tracking the request.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of course data objects.
 */
const fetchCourseDetails = async (token, courseIDsPayload, correlationID) => {
  const courseSearchUrl = `${config.get(
    "server:courseAPIURL"
  )}/api/v2/course/search`;
  const courseData = await postData(
    token,
    courseSearchUrl,
    courseIDsPayload,
    correlationID
  );
  return courseData;
};

const utils = {
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),
  getUser,
  getSessionUser,
  getAccessToken,
  deleteData,
  forwardGetReq,
  getDataWithParams,
  getData,
  getCommonServiceData,
  forwardPostReq,
  postData,
  postCommonServiceData,
  putData,
  putCommonServiceData,
  formatCommentTimestamp,
  errorResponse,
  getCodes,
  cacheMiddleware,
  getBackendServiceToken,
  getCodeTable,
  logApiError,
  cachedApiCall,
  formatQueryParamString,
  getCourseIDsPayload,
  fetchCourseDetails,
  addCourseDetails,
};

module.exports = utils;
