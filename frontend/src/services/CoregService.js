import ApiService from "../common/apiService";

export default {
  getCourseInformationById(courseId) {
    return ApiService.apiAxios.get(
      "/api/v1/coreg/course/information/" + courseId
    );
  },
  getCourseInformationByExternalCode(externalCode) {
    return ApiService.apiAxios.get(
      "/api/v1/coreg/course/information/external/" + externalCode
    );
  },
  getGradProgramCourses(params) {
    if (!!params) {
      const encodedSortParams = encodedURIComponent(
        JSON.stringify(params.sort)
      );
      return ApiService.apiAxios.get(
        `/api/v1/coreg/grad-program-course/information/paginated?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}`
      );
    } else {
      return ApiService.apiAxios.get(
        `/api/v1/coreg/grad-program-course/information/paginated`
      );
    }
  },
};
