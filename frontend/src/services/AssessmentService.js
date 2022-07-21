import ApiService from '../common/apiService';

export default {
  getAllAssesments(){
    return ApiService.apiAxios.get('/api/v1/assessment')
  },
  getAllAssesmentRequirements() {
    return ApiService.apiAxios.get('/api/v1/assessment/requirement')
  },
  getStudentAssessment(pen) {
    return ApiService.apiAxios.get('/api/v1/assessment/pen/'+ pen + '?sortForUI=true')
  }
};
