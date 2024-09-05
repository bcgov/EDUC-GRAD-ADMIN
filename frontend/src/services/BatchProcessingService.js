import ApiService from '../common/apiService';

export default {

  getDashboardInfo() {
    return ApiService.apiAxios.get('/api/v1/batch/dashboard');
  },
  runREGALG(request, cronTime="")
   {
    console.log(cronTime)
    if(cronTime){
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime
      scheduledRequest.jobName = "SGBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return
    }else{
      console.log("REGALG SERVICE")
      console.log(request)
      return ApiService.apiAxios.post('/api/v1/batch/specialrun', request);
    }
  },
  runTVRRUN(request, cronTime="") {
    if(cronTime){
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "STBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      scheduledRequest.psiPayload = null;
      this.addScheduledJob(scheduledRequest);
      return
    }else{
      return ApiService.apiAxios.post('/api/v1/batch/tvrspecialrun', request);
    }
  },
  runDISTRUNUSER(request,credentialType, cronTime="") {
    if(cronTime){
      let scheduledRequest = {};
      if(credentialType == "Blank transcript print" || credentialType == "Blank certificate print"){
        
        scheduledRequest.payload = request;
        scheduledRequest.blankPayLoad = null;
      }else{
        scheduledRequest.payload = null;
        scheduledRequest.blankPayLoad = request;
      }
      scheduledRequest.cronExpression = cronTime
      scheduledRequest.jobName = "URDBJ";
      this.addScheduledJob(scheduledRequest);
      return
    }else{
      if(credentialType == "OT"){
        return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/OT', request);
      }else if(credentialType == "OC"){
        return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/OC', request);
      }else if(credentialType == "RC"){
        return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/RC', request);
      }else if(credentialType == "Blank transcript print"){
        return ApiService.apiAxios.post('/api/v1/batch/userrequestblankdisrun/OT', request);
      }else if(credentialType == "Blank certificate print"){
        return ApiService.apiAxios.post('/api/v1/batch/userrequestblankdisrun/OC', request);
      }
    }

    
  },     
  runDISTRUN_MONTHLY(){
    return ApiService.apiAxios.get('/api/v1/batch/executedisrunbatchjob');
  },
  runDISTRUN_SUPP(){
    return ApiService.apiAxios.get('/api/v1/batch/executesuppdisrunbatchjob');
  },
  runNONGRADRUN(request, cronTime=""){
    if (Array.isArray(request.districts) && request.districts.length === 1 && request.districts[0].toLowerCase() === "all") {
      // If the condition is true, set districts to an empty array
      request.districts = [];
    }
    return ApiService.apiAxios.post('/api/v1/batch/executenongraddisrunbatchjob',request);
  },  
  runDISTRUN_YE(request, cronTime=""){
    if (Array.isArray(request.districts) && request.districts.length === 1 && request.districts[0].toLowerCase() === "all") {
      // If the condition is true, set districts to an empty
      request.districts = [];
    }
    if(cronTime){
      let scheduledRequest = {};
      scheduledRequest.cronExpression = cronTime;
      scheduledRequest.jobName = "YDBJ";
      scheduledRequest.blankPayLoad = null;
      scheduledRequest.payload = request;
      this.addScheduledJob(scheduledRequest);
      return
    }else{
      return ApiService.apiAxios.post('/api/v1/batch/executeyearlydisrunbatchjob', request);
    }
  },
  // runBlankDISTRUNUSERUserRequest(request, credentialType){
  //   return ApiService.apiAxios.post('/api/v1/batch/userrequestblankdisrun/'+ credentialType, request);
  // },
  runPSIRUN(request, transmissionType){
    return ApiService.apiAxios.post('/api/v1/batch/executepsireportbatchjob/' + transmissionType, request);
  },
  getBatchErrors(id, page) {
    return ApiService.apiAxios.get('/api/v1/batch/dashboard/errors/'  + id + '?pageNumber=' + page);
  },
  getBatchSummary() {
    return ApiService.apiAxios.get('/api/v1/batch/dashboard/summary');
  },    
  getScheduledBatchJobs() {
    return ApiService.apiAxios.get('/api/v1/batch/schedule/listjobs');
  },
  addScheduledJob(scheduledJob) {
    console.log("SCHEDULE")
    console.log(scheduledJob)
    return ApiService.apiAxios.post('/api/v1/batch/schedule/add?batchJobTypeCode=' + scheduledJob.jobName, scheduledJob);
  },
  removeScheduledJobs(id) {
    return ApiService.apiAxios.delete('/api/v1/batch/schedule/remove/' + id);
  },
  batchProcessingRoutines() {
    return ApiService.apiAxios.get('/api/v1/batch/processing/all');
  },
  batchProcessingToggleRoutine(jobType){
    return ApiService.apiAxios.put('/api/v1/batch/processing/toggle/' + jobType );
  },
  getBatchJobTypes(){
    return ApiService.apiAxios.get('/api/v1/batch/batchjobtype');
  }, 
  rerunBatchSchoolReports(bid){
    return ApiService.apiAxios.get('/api/v1/batch/regenerate/school-report/' + bid);
  },
  rerunBatch(bid){
    return ApiService.apiAxios.get('/api/v1/batch/rerun/all/' + bid);
  },
  rerunBatchStudentErrors(bid){
    return ApiService.apiAxios.get('/api/v1/batch/rerun/failed/' + bid);
  },    
   
}