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
  getStudentAssessmentHistoryBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
        .get('/api/student-assessment/student-history/paginated', {
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
  async createAssessmentStudent(json, allowRuleOverride = false) {
    const params = allowRuleOverride ? { allowRuleOverride: 'true' } : {};
    return ApiService.apiAxios.post(
      '/api/student-assessment/student/',
      json,
      { params }
    );
  },
  async deleteAssessmentStudent(assessmentStudentId, allowRuleOverride) {
    const params = allowRuleOverride ? { allowRuleOverride: 'true' } : {};
    return ApiService.apiAxios.delete('/api/student-assessment/student/' + assessmentStudentId, { params });
  }
};
