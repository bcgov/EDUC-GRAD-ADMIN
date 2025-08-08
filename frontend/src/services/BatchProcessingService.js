import ApiService from "../common/apiService";

export default {
  getDashboardInfo(params) {
    const encodedSortParams = encodeURIComponent(JSON.stringify(params.sort));
    return ApiService.apiAxios.get(
      //`/api/v2/batch/dashboard?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}`
      `/api/batch/history?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}`
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
      //return ApiService.apiAxios.post("/api/v1/batch/specialrun", request);
      return ApiService.apiAxios.post(
        "/api/batch/run/graduation/regularAlgorithm",
        request
      );
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
      //return ApiService.apiAxios.post("/api/v1/batch/tvrspecialrun", request);
      return ApiService.apiAxios.post("/api/batch/run/graduation/TVR", request);
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
        ///api/batch/userRequest/distribution/originalTranscript
        return ApiService.apiAxios.post(
          //"/api/v1/batch/userrequestdisrun/OT",
          "/api/batch/run/userRequest/distribution/originalTranscript",
          request
        );
      } else if (credentialType == "OC") {
        return ApiService.apiAxios.post(
          //"/api/v1/batch/userrequestdisrun/OC",
          "/api/batch/run/userRequest/distribution/originalCertificate",
          request
        );
      } else if (credentialType == "RC") {
        return ApiService.apiAxios.post(
          //"/api/v1/batch/userrequestdisrun/RC",
          "/api/batch/run/userRequest/distribution/reprintCertificate",
          request
        );
      } else if (credentialType == "Blank transcript print") {
        return ApiService.apiAxios.post(
          //"/api/v1/batch/userrequestblankdisrun/OT",
          "/api/batch/run/userRequest/distribution/blankTranscript",
          request
        );
      } else if (credentialType == "Blank certificate print") {
        return ApiService.apiAxios.post(
          //"/api/v1/batch/userrequestblankdisrun/OC",
          "/api/batch/run/userRequest/distribution/blankCertificate",
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
      //return ApiService.apiAxios.get("/api/v1/batch/executedisrunbatchjob");
      return ApiService.apiAxios.get("/api/batch/run/graduation/distribution");
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
        //`/api/v1/batch/regenerate/school-report`,
        `/api/batch/run/regeneration/schoolReport`,
        request
      );
    }
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
        //"/api/v1/batch/executenongraddisrunbatchjob",
        "/api/batch/run/yearEnd/distribution/nonGraduate",
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
        //"/api/v1/batch/executeyearlydisrunbatchjob",
        "/api/batch/run/yearEnd/distribution/credentials",
        request
      );
    }
  },
  // runBlankDISTRUNUSERUserRequest(request, credentialType) {
  //   return ApiService.apiAxios.post(
  //     "/api/v1/batch/userrequestblankdisrun/" + credentialType,
  //     request
  //   );
  // },
  // runDISTRUN_SUPP() {
  //   return ApiService.apiAxios.get("/api/v1/batch/executesuppdisrunbatchjob");
  // },
  runCERTREGEN_ALL() {
    //To run regenerate all Certificates, you must run a get

    //return ApiService.apiAxios.get("/api/v1/batch/executecertregenbatchjob");
    return ApiService.apiAxios.get("/api/batch/run/regeneration/certificate");
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
        "/api/batch/run/regeneration/certificate",
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
        //"/api/v1/batch/report/student/delete",
        "/api/batch/run/yearEnd/TVRDelete",
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
      //return ApiService.apiAxios.post("/api/v1/batch/student/archive", request);
      return ApiService.apiAxios.post(
        "/api/batch/run/yearEnd/ArchiveStudents",
        request
      );
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
        //"/api/v1/batch/report/school/archive",
        "/api/batch/run/yearEnd/ArchiveSchoolReports",
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
        //"/api/v1/batch/executepsireportbatchjob/" + transmissionType,
        `/api/batch/run/yearEnd/PSI/${transmissionType}`,
        request
      );
    }
  },
  getBatchErrors(id, page) {
    return ApiService.apiAxios.get(
      //"/api/v1/batch/dashboard/errors/" + id + "?pageNumber=" + page
      "/api/batch/history/errors/" + id + "?pageNumber=" + page
    );
  },
  // getBatchSummary() {
  //   return ApiService.apiAxios.get("/api/v1/batch/dashboard/summary");
  // },
  getScheduledBatchJobs() {
    //return ApiService.apiAxios.get("/api/v1/batch/schedule/listjobs");
    return ApiService.apiAxios.get("/api/batch/scheduledJobs");
  },
  addScheduledJob(scheduledJob) {
    return ApiService.apiAxios.post(
      //"/api/v1/batch/schedule/add?batchJobTypeCode=" + scheduledJob.jobName,
      "/api/batch/scheduledJobs/" + scheduledJob.jobName,
      scheduledJob
    );
  },
  removeScheduledJobs(id) {
    //return ApiService.apiAxios.delete("/api/v1/batch/schedule/remove/" + id);
    return ApiService.apiAxios.delete("/api/batch/scheduledJobs/" + id);
  },
  batchProcessingRoutines() {
    //return ApiService.apiAxios.get("/api/v1/batch/processing/all");
    return ApiService.apiAxios.get("/api/batch/routines");
  },
  batchProcessingToggleRoutine(jobType) {
    return ApiService.apiAxios.put("/api/batch/routines/toggle/" + jobType);
  },
  // getBatchJobTypes() { //codes
  //   return ApiService.apiAxios.get("/api/v1/batch/batchjobtype");
  // },
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
