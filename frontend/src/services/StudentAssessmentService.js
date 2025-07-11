import ApiService from '../common/apiService';
import {isEmpty, omitBy} from "lodash";

export default {
  getStudentAssessmentsBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
      .get('/api/student-assessment/paginated', {
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
  }
};
