const { TokenExpiredError } = require("jsonwebtoken");
const {
  errorResponse,
  getData,
  postData,
  putData,
  deleteData,
  formatQueryParamString,
} = require("./utils");
const config = require("../config/index");
const log = require("./logger");
const auth = require("./auth");

async function getCourseByCodeAndLevel(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v2/course${formatQueryParamString(req.query)}`;
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

async function getCourseByID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:courseAPIURL")}/api/v2/course/${
      req.params?.courseID
    }`;
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

async function getCourseRequirements(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/requirement`;
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

async function getAllCourseRestrictions(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/restriction`;
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

async function getCourseRestrictionByCodeAndLevel(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/courserestrictionsearch${formatQueryParamString(req.query)}`;
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

async function postCourseRestriction(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v2/course/save-course-restriction`;
    const data = await postData(
      token,
      url,
      req.body,
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

async function putCourseRestriction(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v2/course/save-course-restriction/${req.params?.restrictionID}`;
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

async function getExaminableCourseSessions(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/examinablecourses`;
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

async function getCourseRequirementsByRule(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/requirement/rule${formatQueryParamString(req.query)}`;
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

async function getCourseRequirements(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/courserequirementsearch${formatQueryParamString(
      req.query
    )}`;
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

async function getStudentCoursesLegacy(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/studentcourse/pen/${
      req.params?.studentPEN
    }?sortForUI=true`;
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

async function getStudentExamDetailsLegacy(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/studentexam/pen/${req.params?.studentPEN}?sortForUI=true`;
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
  getCourseByCodeAndLevel,
  getCourseByID,
  getAllCourseRestrictions,
  getCourseRestrictionByCodeAndLevel,
  postCourseRestriction,
  putCourseRestriction,
  getExaminableCourseSessions,
  getCourseRequirementsByRule,
  getCourseRequirements,
  getStudentCoursesLegacy,
  getStudentExamDetailsLegacy,
};
