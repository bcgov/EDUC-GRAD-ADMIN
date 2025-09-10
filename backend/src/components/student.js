const { TokenExpiredError } = require("jsonwebtoken");
const {
  errorResponse,
  getData,
  postData,
  putData,
  deleteData,
  formatQueryParamString,
  getCourseIDsPayload,
  fetchCourseDetails,
  addCourseDetails,
  sortCourses,
  getUser,
  logApiError,
} = require("../components/utils");
const config = require("../config/index");
const { STUDENT_STATUS_CODE_MAP } = require("./constants/student-status-codes");
const log = require("../components/logger");
const auth = require("../components/auth");
const {
  postStudentAssessment,
  deleteStudentAssessmentByID,
} = require("../components/assessments/student-assessment");
const { add } = require("lodash");

async function getStudentCourseByStudentID(req, res) {
  const token = auth.getBackendToken(req);
  try {
    // Fetch student courses from the student API
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.studentID
    }`;
    const data = await getData(token, url, req.session?.correlationID);
    // Preparing the Course ID Payload
    const courseIDsPayload = getCourseIDsPayload(data);

    // Fetching Detailed Course Information
    const CourseDetails = await fetchCourseDetails(
      token,
      courseIDsPayload,
      req.session?.correlationID
    );

    const studentCoursesWithDetails = addCourseDetails(CourseDetails, data);
    // Final Response
    return res.status(200).json(sortCourses(studentCoursesWithDetails));
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
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.studentID
    }`;
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

async function postStudentCoursesByStudentID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.studentID
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
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.studentID
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
  const courseWithoutID = req.body.map(({ id, ...rest }) => ({ ...rest }));

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.targetStudentID
    }`;
    const createTransferResponse = await postData(
      token,
      url,
      courseWithoutID,
      req.session?.correlationID
    );
    if (
      Array.isArray(createTransferResponse) &&
      createTransferResponse.length > 0
    ) {
      // Collect IDs of successfully transferred courses to delete from source student
      const courseIDsToDelete = createTransferResponse
        .filter((course) => course.hasPersisted)
        .map((course) => {
          const match = req.body.find(
            (reqItem) =>
              reqItem.courseID === course.courseID &&
              reqItem.courseSession === course.courseSession
          );
          return match?.id;
        })
        .filter(Boolean);
      if (courseIDsToDelete.length > 0) {
        const deleteUrl = `${config.get(
          "server:studentAPIURL"
        )}/api/v1/student/courses/${req.params?.sourceStudentID}`;
        await deleteData(
          token,
          deleteUrl,
          courseIDsToDelete,
          req.session?.correlationID
        );
      }
    }
    return res.status(200).json(createTransferResponse);
  } catch (e) {
    log.error("Error transferring student courses:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}
async function transferStudentAssessmentsByStudentID(req, res) {
  try {
    const createResponse = {
      added: [],
      deleted: [],
      errors: [],
    };

    let localStudentAssessments = { ...req.body };

    const tobeDeleted = Object.values(localStudentAssessments)
      .map((assessment) => assessment.assessmentStudentID)
      .filter(Boolean);
    console.log("tobeDeleted: " + JSON.stringify(tobeDeleted));

    const tobeAdded = Object.values(localStudentAssessments);
    console.log("tobeAdded: " + JSON.stringify(tobeAdded));

    // Delete assessments
    if (tobeDeleted && tobeDeleted.length > 0) {
      for (const studentAssessmentId of tobeDeleted) {
        try {
          const clonedReq = {
            ...req,
            query: {
              ...req.query,
              allowRuleOverride: "true",
            },
            params: { studentAssessmentId: assessmentID },
            session: req.session,
          };

          // Assuming deleteStudentAssessmentByID returns a result
          // delete :[{assessmntID: assessmentID, result: data }]
          const deleteResult = await deleteStudentAssessmentByID(clonedReq, {
            status: () => ({
              json: (data) =>
                createResponse.deleted.push({
                  studentAssessmentId: studentAssessmentId,
                  result: data,
                }),
            }),
          });
        } catch (err) {
          console.error(`Failed to delete assessment:`, err);
          createResponse.errors.push({
            type: "delete",
            studentAssessmentId: studentAssessmentId,
            error: err.message,
          });
        }
      }
    }

    // Add assessments
    if (tobeAdded && tobeAdded.length > 0) {
      for (const assessment of tobeAdded) {
        try {
          const { assessmentStudentID, ...assessmentFiltered } = assessment;
          const updatedAssessment = {
            ...assessmentFiltered,
            studentID: req.params["targetStudentID"],
          };

          const clonedReq = {
            ...req,
            body: updatedAssessment,
            query: req.query,
            params: req.params,
            session: req.session,
          };
          const postResult = await postStudentAssessment(clonedReq, {
            status: () => ({ json: (data) => createResponse.added.push(data) }),
          });
        } catch (err) {
          console.error(`Failed to add assessment:`, err);
          createResponse.errors.push({
            type: "add",
            assessmentID: assessment.assessmentID,
            error: err.message,
          });
        }
      }
    }
    // Final response
    return res.status(200).json({
      message: "Assessment reconciliation complete.",
      ...createResponse,
    });
  } catch (e) {
    console.error("Error merging student assessments:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}
// end of transferStudentAssessmentsByStudentID

async function mergeStudentAssessmentsByStudentID(req, res) {
  try {
    const token = auth.getBackendToken(req);
    let localStudentAssessments = { ...req.body };

    // Prepare data
    let tobeDeleted =
      localStudentAssessments.conflicts.length > 0
        ? localStudentAssessments.conflicts
            .map((item) => item.target?.assessmentStudentID)
            .filter((assessmentID) => assessmentID !== undefined)
        : [];

    let tobeAdded = [
      ...localStudentAssessments.info.map((item) => item.source),
      ...localStudentAssessments.conflicts.map((item) => item.source),
    ];

    const createResponse = {
      added: [],
      deleted: [],
      errors: [],
    };

    // Delete assessments
    if (tobeDeleted && tobeDeleted.length > 0) {
      for (const assessmentID of tobeDeleted) {
        try {
          const clonedReq = {
            ...req,
            query: {
              ...req.query,
              allowRuleOverride: "true",
            },
            params: { studentAssessmentId: assessmentID },
            session: req.session,
          };

          // Assuming deleteStudentAssessmentByID returns a result
          const deleteResult = await deleteStudentAssessmentByID(clonedReq, {
            status: () => ({
              json: (data) => createResponse.deleted.push(data),
            }),
          });
        } catch (err) {
          console.error(`Failed to delete assessment:`, err);
          createResponse.errors.push({
            type: "delete",
            assessmentID: assessmentID,
            error: err.message,
          });
        }
      }
    }

    // Add assessments
    if (tobeAdded && tobeAdded.length > 0) {
      for (const assessment of tobeAdded) {
        try {
          const { assessmentStudentID, ...assessmentFiltered } = assessment;
          const updatedAssessment = {
            ...assessmentFiltered,
            studentID: req.params["targetStudentID"],
          };

          const clonedReq = {
            ...req,
            body: updatedAssessment,
            query: req.query,
            params: req.params,
            session: req.session,
          };

          const postResult = await postStudentAssessment(clonedReq, {
            status: () => ({ json: (data) => createResponse.added.push(data) }),
          });
        } catch (err) {
          console.error(`Failed to add assessment:`, err);
          createResponse.errors.push({
            type: "add",
            assessmentID: assessment.assessmentID,
            error: err.message,
          });
        }
      }
    }
    // Final response
    return res.status(200).json({
      message: "Assessment reconciliation complete.",
      ...createResponse,
    });
  } catch (e) {
    console.error("Error merging student assessments:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function mergeStudentCoursesByStudentID(req, res) {
  const token = auth.getBackendToken(req);
  let localStudentCourses = { ...req.body };
  let tobeDeleted =
    localStudentCourses.conflicts.length > 0
      ? localStudentCourses.conflicts
          .map((item) => item.target?.id)
          .filter((id) => id !== undefined)
      : [];
  let tobeAdded = [
    ...localStudentCourses.info.map((item) => item.source),
    ...localStudentCourses.conflicts.map((item) => item.source),
  ];
  const courseWithoutID = tobeAdded.map(({ id, ...rest }) => ({ ...rest }));
  try {
    //Remove courses if any
    if (tobeDeleted && tobeDeleted.length > 0) {
      const deletUrl = `${config.get(
        "server:studentAPIURL"
      )}/api/v1/student/courses/${req.params?.targetStudentID}`;
      const deleteResponse = await deleteData(
        token,
        deletUrl,
        tobeDeleted,
        req.session?.correlationID
      );
      const notDeleted = deleteResponse
        .filter((course) =>
          course.validationIssues?.some(
            (issue) => issue.validationIssueSeverityCode === "ERROR"
          )
        )
        .map((course) => course.id);
      if (notDeleted.length > 0) {
        console.error(
          "Error removing student courses during merge process",
          notDeleted
        );
      }
    }
    //Add courses
    const addUrl = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/courses/${req.params?.targetStudentID}`;
    const createResponse = await postData(
      token,
      addUrl,
      courseWithoutID,
      req.session?.correlationID
    );
    return res.status(200).json(createResponse);
  } catch (e) {
    console.error("Error merging student courses:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function completeStudentMergeByStudentID(req, res) {
  const token = auth.getBackendToken(req);
  const noteUrl = `${config.get(
    "server:studentAPIURL"
  )}/api/v1/student/studentnotes`;
  const gradStatusUrl = `${config.get(
    "server:studentAPIURL"
  )}/api/v1/student/recalculate/grad-status/${req.params?.targetStudentID}`;

  try {
    //Add Note to source & target student
    const sourceResponse = await postData(
      token,
      noteUrl,
      req.body.source,
      req.session?.correlationID
    );
    if (sourceResponse.code !== "success") {
      console.error("Error adding student note to merged pen:", sourceResponse);
      return res.status(500).json({ error: "Adding note failed" });
    }
    const targetResponse = await postData(
      token,
      noteUrl,
      req.body.target,
      req.session?.correlationID
    );
    if (targetResponse.code !== "success") {
      console.error("Error adding student note to true pen:", targetResponse);
      return res.status(500).json({ error: "Adding note failed" });
    }
    //Update Grad Status for target student
    const gradStatusResponse = await putData(
      token,
      gradStatusUrl,
      null,
      req.session?.correlationID
    );
    return res.status(200).json(gradStatusResponse);
  } catch (e) {
    console.error("Error completing student merge process:", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentCourseHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/courses/${
      req.params?.studentID
    }/history`;
    const data = await getData(token, url, req.session?.correlationID);
    // Preparing the Course ID Payload
    const courseIDsPayload = getCourseIDsPayload(data);
    // Fetching Detailed Course Information
    const CourseDetails = await fetchCourseDetails(
      token,
      courseIDsPayload,
      req.session?.correlationID
    );
    const studentCoursesWithDetails = addCourseDetails(CourseDetails, data);
    return res.status(200).json(sortCourses(studentCoursesWithDetails));
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function postStudentCareerProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${
      req.params?.studentID
    }/careerPrograms`;
    const data = await postData(
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

async function deleteStudentCareerProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${
      req.params?.studentID
    }/careerPrograms/${req.params?.careerProgramCode}`;
    const data = await deleteData(
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

async function postStudentOptionalProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${
      req.params?.studentID
    }/optionalPrograms/${req.params?.optionalProgramID}`;
    const data = await postData(
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

async function deleteStudentOptionalProgram(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/${
      req.params?.studentID
    }/optionalPrograms/${req.params?.optionalProgramID}`;
    const data = await deleteData(
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

async function getStudentOptionalPrograms(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/optionalprogram/studentid/${req.params?.studentID}`;
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

async function getStudentGradStatusHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentHistory/${req.params?.studentID}`;
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

async function getStudentOptionalProgramHistory(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentOptionalProgramHistory/${req.params?.studentID}`;
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

async function getBatchHistoryStudents(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentHistory/batchid/${
      req.params?.batchID
    }?pageNumber=${req.query?.pageNumber}&pageSize=${req.query?.pageSize}`;
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

async function getStudentGradStatus(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentid/${req.params?.studentID}`;
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentUndoCompletion(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentGraduationAPIURL"
    )}/api/v1/studentgraduation/undocompletion/studentundocompletionreason/studentid/${
      req.params?.studentID
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

async function postStudentUndoCompletion(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/undocompletionstudent/studentid/${
      req.params?.studentID
    }?ungradReasonCode=${req.query?.reasonCode}&ungradReasonDesc=${
      req.query?.reasonDecision
    }`;
    const data = await postData(
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

async function getRunGradAlgorithm(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationAPIURL"
    )}/api/v1/graduate/studentid/${req.params?.studentID}/run/GS`;
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

async function getRunPreviewFinalMarks(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationAPIURL"
    )}/api/v1/graduate/studentid/${req.params?.studentID}/run/FM`;
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

async function getRunTranscriptVerification(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationAPIURL"
    )}/api/v1/graduate/studentid/${req.params?.studentID}/run/REGFM`;
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

async function getRunUpdateTranscript(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationAPIURL"
    )}/api/v1/graduate/studentid/${req.params?.studentID}/run/FMR`;
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

async function mergeStudentGradStatus(req, res) {
  const token = auth.getBackendToken(req);

  const baseURL = config.get("server:studentAPIURL");

  const gradStatusPayload = Object.fromEntries(
    Object.entries(req.body).filter(
      ([key]) => !["optionalPrograms", "careerPrograms"].includes(key)
    )
  );

  const mergeResponse = {
    updated: [],
    deleted: [],
    errors: [],
  };

  const optionalProgramsPayload = req.body.optionalPrograms;
  const careerProgramsPayload = {
    careerProgramCodes:
      req.body.careerPrograms?.map(
        (careerProgram) => careerProgram.careerProgramCode
      ) || [],
  };

  try {
    const gradStatusUrl = `${baseURL}/api/v1/student/gradstudent/studentid/${req.params?.trueStudentID}`;
    const gradStatusResponse = await postData(
      token,
      gradStatusUrl,
      gradStatusPayload,
      req.session?.correlationID
    );

    mergeResponse.updated.push(gradStatusResponse);

    if (!!optionalProgramsPayload && optionalProgramsPayload.length > 0) {
      if (!!gradStatusResponse.careerPrograms) {
        // delete career programs on target
        for (careerProgram of gradStatusResponse.careerPrograms) {
          let response = await deleteData(
            token,
            `${baseURL}/api/v1/student/${req.params?.trueStudentID}/careerPrograms/${careerProgram.careerProgramCode}`
          );

          mergeResponse.deleted.push(response);
        }
      }
      if (!!gradStatusResponse.optionalPrograms) {
        // delete opt programs on target

        for (optionalProgram of gradStatusResponse.optionalPrograms) {
          let response = await deleteData(
            token,
            `${baseURL}/api/v1/student/${req.params?.trueStudentID}/optionalPrograms/${optionalProgram.optionalProgramID}`
          );
          mergeResponse.deleted.push(response);
        }
      }
    }

    // add careerPrograms and optionalPrograms
    if (careerProgramsPayload.length > 0) {
      let response = await postData(
        token,
        `${baseURL}/api/v1/student/${req.params?.trueStudentID}/careerPrograms`,
        careerProgramsPayload,
        req.session?.correlationID
      );

      mergeResponse.updated.push(response.data);
    }
    for (optionalProgram of optionalProgramsPayload) {
      if (optionalProgram.optionalProgramCode != "CP") {
        let response = await postData(
          token,
          `${baseURL}/api/v1/student/${req.params?.trueStudentID}/optionalPrograms/${optionalProgram.optionalProgramID}`
        );
        mergeResponse.updated.push(response.data);
      }
    }

    return res.status(200).json(mergeResponse);
  } catch (e) {
    log.error("Error merging student Grad Status: ", e);
    if (e?.data?.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentTranscript(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/studenttranscript/${req.params?.studentID}`;
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

async function getStudentTVR(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/studentreport/${req.params?.studentID}`;
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

async function getStudentCertificate(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/studentcertificate/${req.params?.studentID}`;
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

async function getStudentXMLReport(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationAPIURL"
    )}/api/v1/graduate/report/transcript/${
      req.params?.studentPEN
    }?interim=Interim&preview=true`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else if (e.status) {
      return errorResponse(
        res,
        "there was an error getting student XML Preview",
        e.status
      );
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
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
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentByPen(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/pen/${
      req.params?.studentPEN
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

async function getStudentByID(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/stdid/${
      req.params?.studentID
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

async function postAdoptPENStudent(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:studentAPIURL")}/api/v1/student/adopt/${
      req.params?.studentID
    }`;
    const data = await postData(token, url, null, req.session?.correlationID);
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
  // STUDENT COURSES
  getStudentCourseByStudentID,
  putStudentCoursesByStudentID,
  postStudentCoursesByStudentID,
  deleteStudentCoursesByStudentID,
  transferStudentCoursesByStudentID,
  mergeStudentCoursesByStudentID,
  completeStudentMergeByStudentID,
  getStudentCourseHistory,
  // STUDENT ASSESSMENTS
  mergeStudentAssessmentsByStudentID,
  transferStudentAssessmentsByStudentID,
  // STUDENT OPTIONAL AND CAREER PROGRAMS
  getStudentCareerPrograms,
  postStudentCareerProgram,
  deleteStudentCareerProgram,
  getStudentOptionalPrograms,
  postStudentOptionalProgram,
  deleteStudentOptionalProgram,
  // STUDENT HISTORY
  getStudentGradStatusHistory,
  getStudentOptionalProgramHistory,
  getBatchHistoryStudents,
  // STUDENT GRAD PROGRAM
  getStudentGradStatus,
  postStudentGradStatus,
  getStudentUndoCompletion,
  postStudentUndoCompletion,
  getRunGradAlgorithm,
  getRunPreviewFinalMarks,
  getRunTranscriptVerification,
  getRunUpdateTranscript,
  mergeStudentGradStatus,
  // STUDENT REPORTS
  getStudentTranscript,
  getStudentTVR,
  getStudentCertificate,
  getStudentXMLReport,
  // STUDENT NOTES
  getStudentNotes,
  postStudentNotes,
  deleteStudentNotes,
  // STUDENT SEARCH
  getStudentAdvancedSearch,
  getStudentByPen,
  getStudentByID,
  // STUDENT ADOPT
  postAdoptPENStudent,
};
