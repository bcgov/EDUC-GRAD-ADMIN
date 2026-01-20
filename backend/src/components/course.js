const {
  errorResponse,
  getData,
  getDataWithParams,
  postData,
  putData,
  formatQueryParamString,
  getCommonServiceStream,
  logApiError,
} = require('./utils');
const config = require('../config/index');
const auth = require('./auth');
const log = require('./logger');

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

async function getCourseEventHistory(req, res) {
  const token = auth.getBackendToken(req);

  const sort =
    typeof req.query?.sort === 'string'
      ? JSON.parse(req.query.sort)
      : req.query.sort;

  const searchParams =
    typeof req.query?.searchParams === 'string'
      ? JSON.parse(req.query.searchParams)
      : req.query.searchParams;

  searchParams.push({
    condition: 'AND',
    searchCriteriaList: [
      {
        key: 'event.affectedTable',
        operation: 'eq',
        value: 'CRSE_COURSES',
        valueType: 'STRING',
        condition: 'AND',
      },
    ]
  });
  
  try {
    const url = `${config.get(
      'server:courseAPIURL'
    )}/api/v1/course/event/history/paginated?pageNumber=${
      req.query?.pageNumber
    }&pageSize=${req.query?.pageSize}&sort=${encodeURIComponent(
      JSON.stringify(sort)
    )}&searchParams=${encodeURIComponent(JSON.stringify(searchParams))}`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    log.error(
      e,
      'eventHistoryError',
      'Error occurred while attempting to get institute events'
    );
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function putCourseEventHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/event/history`;
    const data = await putData(
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

async function downloadCourseRestrictionsCSV(req, res) {
  try {
    const url = `${config.get('server:courseAPIURL')}/api/v2/course/course-restrictions/download`;
    const apiRes = await getCommonServiceStream(url, {});

    if (apiRes.headers['content-type']) {
      res.setHeader('Content-Type', apiRes.headers['content-type']);
    } else {
      res.setHeader('Content-Type', 'text/csv');
    }

    if (apiRes.headers['content-disposition']) {
      res.setHeader('Content-Disposition', apiRes.headers['content-disposition']);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename="CourseRestrictions.csv"');
    }

    apiRes.data.on('error', async (err) => {
      await logApiError(err, 'Error streaming course restrictions CSV');
      if (!res.headersSent) {
        return errorResponse(res);
      }
      res.destroy(err);
    });

    apiRes.data.pipe(res);
  } catch (e) {
    log.error('downloadCourseRestrictionsCSV error:', e);
    await logApiError(e, 'Error downloading course restrictions CSV');
    if (!res.headersSent) {
      if (e.data?.message) {
        return errorResponse(res, e.data.message, e.status);
      }
      return errorResponse(res);
    }
  }
}

async function getCoursePaginated(req, res) {
  try {
    const token = await auth.getBackendServiceToken();
    const url = `${config.get('server:coregAPIURL')}/api/v1/course/information/paginated`;

    const pageNumber = req.query.pageNumber;
    const pageSize = req.query.pageSize;
    const sort = req.query.sort;
    const searchCriteriaList = req.query.searchCriteriaList;

    const params = {
      params: {
        pageNumber,
        pageSize,
        sort,
        searchCriteriaList
      }
    };

    const response = await getDataWithParams(token, url, params, req.session?.correlationID);


    return res.status(200).json(response);
  } catch (e) {
    log.error('Error getting paginated courses:', e);
    if (e.data?.message) {
      return errorResponse(res, e.data.message, e.status);
    }
    return errorResponse(res);
  }
}

async function downloadCoursesCSV(req, res) {
  try {
    const url = `${config.get('server:coregAPIURL')}/api/v1/course/information/download`;

    log.debug('Streaming course search CSV download');
    const response = await getCommonServiceStream(url);

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment; filename="Courses.csv"');

    response.data.pipe(res);
  } catch (e) {
    log.error('Error downloading course search CSV:', e);
    if (e.data?.message) {
      return errorResponse(res, e.data.message, e.status);
    }
    return errorResponse(res);
  }
}

async function getAllCoreg39Courses(req, res) {
  try {
    const cacheService = require('./cache-service');
    const courses = cacheService.getAllCoreg39CoursesJSON();
    return res.status(200).json(courses);
  } catch (e) {
    log.error('Error getting coreg39 courses from cache:', e);
    return errorResponse(res);
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
  getCourseEventHistory,
  putCourseEventHistory,
  downloadCourseRestrictionsCSV,
  getCoursePaginated,
  downloadCoursesCSV,
  getAllCoreg39Courses,
};
