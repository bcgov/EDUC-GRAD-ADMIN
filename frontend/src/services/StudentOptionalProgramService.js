import ApiService from '../common/apiService';
import {isEmpty, omitBy} from "lodash";

export default {
  getStudentOptionalProgramsBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
      .get('/api/student-optional-program/student/paginated', {
        params: {
          pageNumber: pageNumber - 1,
          pageSize: pageSize,
          searchParams: omitBy(searchParams, isEmpty),
          sort: sort,
        },
      })
  },
  downloadOptionalProgramStudentSearchReport(searchParams) {
    return ApiService.apiAxios.get('/api/student-optional-program/report/optional-program-students/search/download', {
      params: {
        searchParams: omitBy(searchParams, isEmpty),
      },
      responseType: 'blob',
    });
  }
};

