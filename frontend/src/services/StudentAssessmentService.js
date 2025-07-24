import ApiService from '../common/apiService';
import {isEmpty, omitBy} from "lodash";

export default {
  getStudentAssessmentsBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
      .get('/api/student-assessment/student/paginated', {
        params: {
          pageNumber: pageNumber - 1,
          pageSize: pageSize,
          searchParams: omitBy(searchParams, isEmpty),
          sort: sort,
        },
      })
  },
  getAssessmentTypeCodes() {
    return ApiService.apiAxios.get('/api/student-assessment/assessment-type-codes')
  },
  getProvincialSpecialCaseCodes() {
    return ApiService.apiAxios.get('/api/student-assessment/provincial-special-case-codes');
  },
  getAssessmentSessions() {
    return ApiService.apiAxios.get('/api/student-assessment/sessions/')
  },
  async updateAssessmentStudent(assessmentStudentId, json) {
    return ApiService.apiAxios.put(
      `/api/student-assessment/student/` + assessmentStudentId,
      json
    );
  },
  async createAssessmentStudent(json) {
    return ApiService.apiAxios.post(
      '/api/student-assessment/student/',
      json
    );
  },
  async deleteAssessmentStudent(assessmentStudentId) {
    return ApiService.apiAxios.delete('/api/student-assessment/student/' + assessmentStudentId);
  }
};
