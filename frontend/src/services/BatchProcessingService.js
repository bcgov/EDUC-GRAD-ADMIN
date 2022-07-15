import ApiService from '../common/apiService';

export default {
  getDashboardInfo() {
    return ApiService.apiAxios.get('/api/v1/batch/dashboard');
  },
  runREGALG(users) {
    return ApiService.apiAxios.post('/api/v1/batch/specialrun', users);
  },
  runTVRRUN(users) {
    return ApiService.apiAxios.post('/api/v1/batch/tvrspecialrun', users);
  },
  runDISTRUN(users,credentialType) {
    if(credentialType == "OT"){
      return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/OT', users);
    }else if(credentialType == "OC"){
      return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/OC', users);
    }else if(credentialType == "RC"){
      return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/RC', users);
    }
  },     
  runOriginalCertificateDISTRUN(users) {
    return ApiService.apiAxios.post('/api/v1/batch/userrequestdisrun/OC', users);
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
    return ApiService.apiAxios.post('/api/v1/batch/schedule/add', scheduledJob);
  },
  removeScheduledJobs(id) {
    return ApiService.apiAxios.delete('/api/v1/batch/schedule/remove/' + id);
  }
}