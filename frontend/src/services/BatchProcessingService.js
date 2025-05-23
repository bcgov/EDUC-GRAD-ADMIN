import ApiService from "../common/apiService";

export default {
  getDashboardInfo(params) {
    const encodedSortParams = encodeURIComponent(JSON.stringify(params.sort));
    return ApiService.apiAxios.get(
      `/api/v2/batch/dashboard?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}`
    );
  },
  runREGALG(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "SGBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post("/api/v1/batch/specialrun", request);
    }
  },
  runTVRRUN(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "STBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      scheduledRequest.psiPayload = null;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post("/api/v1/batch/tvrspecialrun", request);
    }
  },
  runDISTRUNUSER(request, credentialType, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};

      //For Blank transcript print or Blank certificate print option, the payload must use the blankPayload
      if (
        credentialType == "Blank transcript print" ||
        credentialType == "Blank certificate print"
      ) {
        scheduledRequest.payload = null;
        scheduledRequest.blankPayLoad = request;
      } else {
        scheduledRequest.payload = request;
        scheduledRequest.blankPayLoad = null;
      }

      if (credentialType == "OT" && request.psi && request.psi.length > 0) {
        scheduledRequest.psiPayload = request;
        scheduledRequest.payload = null;
        scheduledRequest.blankPayLoad = null;
      }

      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "URDBJ";
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      if (credentialType == "OT") {
        return ApiService.apiAxios.post(
          "/api/v1/batch/userrequestdisrun/OT",
          request
        );
      } else if (credentialType == "OC") {
        return ApiService.apiAxios.post(
          "/api/v1/batch/userrequestdisrun/OC",
          request
        );
      } else if (credentialType == "RC") {
        return ApiService.apiAxios.post(
          "/api/v1/batch/userrequestdisrun/RC",
          request
        );
      } else if (credentialType == "Blank transcript print") {
        return ApiService.apiAxios.post(
          "/api/v1/batch/userrequestblankdisrun/OT",
          request
        );
      } else if (credentialType == "Blank certificate print") {
        return ApiService.apiAxios.post(
          "/api/v1/batch/userrequestblankdisrun/OC",
          request
        );
      }
    }
  },
  runDISTRUN_MONTHLY(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "MDBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
    } else {
      return ApiService.apiAxios.get("/api/v1/batch/executedisrunbatchjob");
    }
  },
  runSCHL_RPT_REGEN(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "SRRBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
    } else {
      return ApiService.apiAxios.post(
        `/api/v1/batch/regenerate/school-report`,
        request
      );
    }
  },
  runDISTRUN_SUPP() {
    return ApiService.apiAxios.get("/api/v1/batch/executesuppdisrunbatchjob");
  },
  runNONGRADRUN(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "NDBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest, id);
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/executenongraddisrunbatchjob",
        request
      );
    }
  },
  runDISTRUN_YE(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "YDBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/executeyearlydisrunbatchjob",
        request
      );
    }
  },
  runBlankDISTRUNUSERUserRequest(request, credentialType) {
    return ApiService.apiAxios.post(
      "/api/v1/batch/userrequestblankdisrun/" + credentialType,
      request
    );
  },
  runDISTRUN_SUPP() {
    return ApiService.apiAxios.get("/api/v1/batch/executesuppdisrunbatchjob");
  },
  runCERTREGEN_ALL() {
    //To run regenerate all Certificates, you must run a get

    return ApiService.apiAxios.get("/api/v1/batch/executecertregenbatchjob");
  },
  runCERTREGEN(request, cronTime = "") {
    if (
      Array.isArray(request.districts) &&
      request.districts.length === 1 &&
      request.districts[0].toLowerCase() === "all"
    ) {
      // If the condition is true, set districts to an empty array
      request.districts = [];
    }
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "RCBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/executecertregenbatchjob",
        request
      );
    }
  },
  runTVR_DELETE(request, cronTime = "") {
    request.reportTypes = ["ACHV"];
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "DSRBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      scheduledRequest.psiPayload = null;
      this.addScheduledJob(scheduledRequest);
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/report/student/delete",
        request
      );
    }
  },
  runArchiveStudents(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "ASBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post("/api/v1/batch/student/archive", request);
    }
  },
  runArchiveSchoolReports(request, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "ASRBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/report/school/archive",
        request
      );
    }
  },
  runPSIRun(request, transmissionType, cronTime = "") {
    if (cronTime) {
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "URPDBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return;
    } else {
      return ApiService.apiAxios.post(
        "/api/v1/batch/executepsireportbatchjob/" + transmissionType,
        request
      );
    }
  },
  getBatchErrors(id, page) {
    return ApiService.apiAxios.get(
      "/api/v1/batch/dashboard/errors/" + id + "?pageNumber=" + page
    );
  },
  getBatchSummary() {
    return ApiService.apiAxios.get("/api/v1/batch/dashboard/summary");
  },
  getScheduledBatchJobs() {
    return ApiService.apiAxios.get("/api/v1/batch/schedule/listjobs");
  },
  addScheduledJob(scheduledJob) {
    return ApiService.apiAxios.post(
      "/api/v1/batch/schedule/add?batchJobTypeCode=" + scheduledJob.jobName,
      scheduledJob
    );
  },
  removeScheduledJobs(id) {
    return ApiService.apiAxios.delete("/api/v1/batch/schedule/remove/" + id);
  },
  batchProcessingRoutines() {
    return ApiService.apiAxios.get("/api/v1/batch/processing/all");
  },
  batchProcessingToggleRoutine(jobType) {
    return ApiService.apiAxios.put(
      "/api/v1/batch/processing/toggle/" + jobType
    );
  },
  getBatchJobTypes() {
    return ApiService.apiAxios.get("/api/v1/batch/batchjobtype");
  },
  rerunBatchSchoolReports(bid) {
    return ApiService.apiAxios.get(
      "/api/v1/batch/regenerate/school-report/" + bid
    );
  },
  rerunBatch(bid) {
    return ApiService.apiAxios.get("/api/v1/batch/rerun/all/" + bid);
  },
  rerunBatchStudentErrors(bid) {
    return ApiService.apiAxios.get("/api/v1/batch/rerun/failed/" + bid);
  },
};
