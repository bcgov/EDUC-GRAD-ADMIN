import ApiService from '../common/apiService';
import {isEmpty, omitBy} from "lodash";

export default {
  getStudentProgramsBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
      .get('/api/student-program/student/paginated', {
        params: {
          pageNumber: pageNumber - 1,
          pageSize: pageSize,
          searchParams: omitBy(searchParams, isEmpty),
          sort: sort,
        },
      })
  },
  downloadProgramStudentSearchReport(searchParams) {
    return ApiService.apiAxios.get('/api/student-program/report/program-students/search/download', {
      params: {
        searchParams: omitBy(searchParams, isEmpty),
      },
      responseType: 'blob',
    });
  }
};

