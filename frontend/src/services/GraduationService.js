import ApiService from '../common/apiService';

export default {
  graduateStudent(id) {
    return ApiService.apiAxios.get('/api/v1/graduate/studentid/' + id + '/run/GS')
  },
  projectedGradFinalMarks(id) {
    return ApiService.apiAxios.get('/api/v1/graduate/studentid/' + id + '/run/FM')
  },
  projectedGradStatusWithFinalAndReg(id) {
    return ApiService.apiAxios.get('/api/v1/graduate/studentid/' + id + '/run/REGFM')
  },
  updateStudentReports(id) {
    return ApiService.apiAxios.get('/api/v1/graduate/studentid/' + id + '/run/FMR')
  }
}