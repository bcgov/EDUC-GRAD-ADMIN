import ApiService from '../common/apiService';

export default {
  getAllAssesments(){
    return ApiService.apiAxios.get('/api/v1/assessment')
  },
  getAllAssesmentRequirements() {
    return ApiService.apiAxios.get('/api/v1/assessment/requirement')
  },
  getRuleCourseRequirements(rule) {
    return ApiService.apiAxios.get('/api/v1/assessment/requirement/rule?rule=' + rule)
  },
  getStudentAssessmentLegacy(pen) {
    return ApiService.apiAxios.get('/api/v1/assessment/pen/'+ pen + '?sortForUI=true')
  }
};
