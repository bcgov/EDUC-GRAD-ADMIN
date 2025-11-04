const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");
const {
  errorResponse,
  getData,
  postData,
  deleteData,
  putData,
} = require("../components/utils");

async function getBatchHistoryDashboard(req, res) {
  const token = auth.getBackendToken(req);

  const sort =
    typeof req.query?.sort === "string"
      ? JSON.parse(req.query.sort)
      : req.query.sort;
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v2/batch/dashboard?pageNumber=${req.query?.pageNumber}&pageSize=${
      req.query?.pageSize
    }&sort=${encodeURIComponent(JSON.stringify(sort))}`;
    console.log("URL - ", url);
    console.log(typeof req.query.sort);
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

async function getBatchHistoryErrors(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/dashboard/errors/${req.params?.batchID}?pageNumber=${
      req.query?.pageNumber
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

async function getRerunSchoolReports(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/regenerate/school-report/${req.params?.batchID}`;
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

async function getRerunBatch(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get("server:batchAPIURL")}/api/v1/batch/rerun/all/${
      req.params?.batchID
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

async function getRerunFailed(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/rerun/failed/${req.params?.batchID}`;
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

async function getBatchScheduledJobs(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/schedule/listjobs`;
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

async function postCreateScheduledJob(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/schedule/add?batchJobTypeCode=${req.params?.jobTypeCode}`;
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

async function deleteScheduledJob(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/schedule/remove/${req.params?.jobID}`;
    const data = await deleteData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}

async function getBatchProcessingRoutines(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/processing/all`;
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

async function putBatchProcessingRoutineToggle(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/processing/toggle/${req.params?.jobType}`;
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

async function postRegularGraduationAlgorithmBatch(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get("server:batchAPIURL")}/api/v1/batch/specialrun`;
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

async function postTranscriptVerificationReportBatch(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/tvrspecialrun`;
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

async function postMonthlyDistributionRun(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/executedisrunbatchjob`;
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

async function postUserRequestDistributionOriginalTranscript(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/userrequestdisrun/OT`;
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

async function postUserRequestDistributionOriginalCertificate(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/userrequestdisrun/OC`;
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

async function postUserRequestDistributionReprintCertificate(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/userrequestdisrun/RC`;
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

async function postUserRequestBlankCertificate(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/userrequestblankdisrun/OC`;
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

async function postUserRequestBlankTranscript(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/userrequestblankdisrun/OT`;
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

async function postUserRequestRegenSchoolReport(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/regenerate/school-report`;
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

async function postUserRequestRegenCertificate(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/executecertregenbatchjob`;
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
async function getUserRequestRegenCertificate(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/executecertregenbatchjob`;
    const data = await getData(
      token, url, req.session?.correlationID
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

async function postYearEndPSIRun(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/executepsireportbatchjob/${req.params?.transmissionType}`;
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

async function postNonGraduateTranscriptDistributionRun(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/regenerate/school-report`;
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

async function postYearEndCredentialsDistributionRun(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/executeyearlydisrunbatchjob`;
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

async function postYearEndTVRDelete(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/report/student/delete`;
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

async function postArchiveStudents(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/student/archive`;
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

async function postArchiveSchoolReports(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:batchAPIURL"
    )}/api/v1/batch/report/school/archive`;
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

async function getUserDistributionDownload(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:distributionAPIURL"
    )}/api/v1/distribute/download/${req.params?.batchID}`;
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

module.exports = {
  getBatchHistoryDashboard,
  getBatchHistoryErrors,
  getRerunSchoolReports,
  getRerunBatch,
  getRerunFailed,
  getBatchScheduledJobs,
  postCreateScheduledJob,
  deleteScheduledJob,
  getBatchProcessingRoutines,
  putBatchProcessingRoutineToggle,
  postRegularGraduationAlgorithmBatch,
  postTranscriptVerificationReportBatch,
  postMonthlyDistributionRun,
  postUserRequestDistributionOriginalTranscript,
  postUserRequestDistributionOriginalCertificate,
  postUserRequestDistributionReprintCertificate,
  postUserRequestBlankCertificate,
  postUserRequestBlankTranscript,
  postUserRequestRegenSchoolReport,
  postUserRequestRegenCertificate,
  postYearEndPSIRun,
  postNonGraduateTranscriptDistributionRun,
  postYearEndCredentialsDistributionRun,
  postYearEndTVRDelete,
  postArchiveStudents,
  postArchiveSchoolReports,
  getUserDistributionDownload,
  getUserRequestRegenCertificate
};
