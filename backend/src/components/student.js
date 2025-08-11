const { TokenExpiredError } = require("jsonwebtoken");
const {
  errorResponse,
  getData,
  postData,
  putData,
  deleteData,
  formatQueryParamString,
} = require("../components/utils");
const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");

async function getStudentCourseByStudentID(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.studentID
      }`;
    const data = await getData(token, url, req.session?.correlationID);

    const courseIDsPayload = {
      courseIds: Array.isArray(data)
        ? data.flatMap(course => {
          const ids = [];
          if (course.courseID) ids.push(Number(course.courseID));
          if (course.relatedCourseId) ids.push(Number(course.relatedCourseId));
          return ids;
        })
        : []
    };

    const courseSearchUrl = `${config.get("server:courseAPIURL")}/api/v2/course/search`;
    const courseData = await postData(token, courseSearchUrl, courseIDsPayload, req.session?.correlationID);

    const courseMap = new Map(
      courseData.map(course => [course.courseID, course])
    );

    // Add courseDetails and releatedCourseDetails from course endpoint
    const studentCoursesWithDetails = data.map(studentCourse => {
      const courseID = studentCourse.courseID;
      const relatedCourseId = studentCourse.relatedCourseId;

      const matchedCourse = courseMap.get(courseID);
      const matchedRelatedCourse = courseMap.get(relatedCourseId);

      return {
        ...studentCourse,
        courseDetails: matchedCourse || null,
        relatedCourseDetails: matchedRelatedCourse || null
      };
    });
    return res.status(200).json(studentCoursesWithDetails);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function putStudentCoursesByStudentID(req, res) {

  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.studentID
      }`;
    const data = await putData(
      token,
      req.body,
      url,
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

async function postStudentCoursesByStudentID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.studentID
      }`;
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

async function deleteStudentCoursesByStudentID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.studentID
      }`;
    const data = await deleteData(
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

async function transferStudentCoursesByStudentID(req, res) {
  const token = auth.getBackendToken(req);
  const courseWithoutID = req.body.map(({id, ...rest }) => ({ ...rest }));

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.targetStudentID
      }`;
    const createTransferResponse = await postData(
      token,
      url,
      courseWithoutID,
      req.session?.correlationID
    );
    if (Array.isArray(createTransferResponse) && createTransferResponse.length > 0) {
      // Collect IDs of successfully transferred courses to delete from source student
      const courseIDsToDelete = createTransferResponse
        .filter(course => course.hasPersisted)
        .map(course => {
          const match = req.body.find(
            reqItem =>
              reqItem.courseID === course.courseID &&
              reqItem.courseSession === course.courseSession
          );
          return match?.id;
        })
        .filter(Boolean); 
      if (courseIDsToDelete.length > 0) {
        const deleteUrl = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.sourceStudentID}`;
        await deleteData(token, deleteUrl, courseIDsToDelete, req.session?.correlationID);
      }
    }
    return res.status(200).json(createTransferResponse);
  } catch (e) {
    console.error("Error transferring student courses:", e);
    if (e?.createTransferResponse?.messages) {
      return errorResponse(res, e.createTransferResponse.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentCourseHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${req.params?.studentID
      }/history`;
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

async function getStudentCareerPrograms(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentcareerprogram/studentid/${req.params?.studentID}`;
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

async function postStudentCareerProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${req.params?.studentID
      }/careerPrograms`;
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

async function deleteStudentCareerProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${req.params?.studentID
      }/careerPrograms/${req.params?.careerProgramCode}`;
    const data = await deleteData(
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

async function postStudentOptionalProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${req.params?.studentID
      }/optionalPrograms/${req.params?.optionalProgramID}`;
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

async function deleteStudentOptionalProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${req.params?.studentID
      }/optionalPrograms/${req.params?.optionalProgramID}`;
    const data = await deleteData(
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

async function getStudentOptionalPrograms(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/optionalprogram/studentid/${req.params?.studentID}`;
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

async function getStudentGradStatusHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentHistory/${req.params?.studentID}`;
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

async function getStudentOptionalProgramHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentOptionalProgramHistory/${req.params?.studentID}`;
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

async function getBatchHistoryStudents(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentHistory/batchid/${req.params?.batchID
      }?pageNumber=${req.query?.pageNumber}&pageSize=${req.query?.pageSize}`;
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

async function getStudentGradStatus(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentid/${req.params?.studentID}`;
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

async function postStudentGradStatus(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/gradstudent/studentid/${req.params?.studentID}`;
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

async function postStudentUndoCompletion(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/undocompletionstudent/studentid/${req.params?.studentID
      }?ungradReasonCode=${req.query?.reasonCode}&ungradReasonDesc=${req.query?.reasonDecision
      }`;
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

async function getStudentNotes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentnotes/studentid/${req.params?.studentID}`;
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

async function postStudentNotes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentnotes`;
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

async function deleteStudentNotes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentnotes/${req.params?.noteID}`;
    const data = await deleteData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentAdvancedSearch(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/gradstudentsearch${formatQueryParamString(req.query)}`;
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

async function getStudentByPen(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/pen/${req.params?.studentPEN
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

async function getStudentByID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/stdid/${req.params?.studentID
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

async function postAdoptPENStudent(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/adopt/${req.params?.studentID}`;
    const data = await postData(
      token,
      url,
      null,
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
  getStudentCourseByStudentID,
  putStudentCoursesByStudentID,
  postStudentCoursesByStudentID,
  deleteStudentCoursesByStudentID,
  transferStudentCoursesByStudentID,
  getStudentCourseHistory,
  getStudentCareerPrograms,
  postStudentCareerProgram,
  deleteStudentCareerProgram,
  getStudentOptionalPrograms,
  postStudentOptionalProgram,
  deleteStudentOptionalProgram,
  getStudentGradStatusHistory,
  getStudentOptionalProgramHistory,
  getBatchHistoryStudents,
  getStudentGradStatus,
  postStudentGradStatus,
  postStudentUndoCompletion,
  getStudentNotes,
  postStudentNotes,
  deleteStudentNotes,
  getStudentAdvancedSearch,
  getStudentByPen,
  getStudentByID,
  postAdoptPENStudent,
};
