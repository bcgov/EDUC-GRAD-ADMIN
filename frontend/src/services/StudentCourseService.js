import ApiService from '../common/apiService';
import {isEmpty, omitBy} from "lodash";

export default {
  getStudentCoursesBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
    return ApiService.apiAxios
      .get('/api/student-course/student/paginated', {
        params: {
          pageNumber: pageNumber - 1,
          pageSize: pageSize,
          searchParams: omitBy(searchParams, isEmpty),
          sort: sort,
        },
      })
  },
  downloadCourseStudentSearchReport(searchParams) {
    return ApiService.apiAxios.get('/api/student-course/report/course-students/search/download', {
      params: {
        searchParams: omitBy(searchParams, isEmpty),
      },
    });
  }
};

