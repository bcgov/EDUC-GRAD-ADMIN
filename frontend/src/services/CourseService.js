import ApiService from "../common/apiService";

export default {
  getCourseByCodeAndLevel(courseCode, courseLevel) {
    return ApiService.apiAxios.get(
      `/api/course/search?courseCode=${courseCode}&courseLevel=${courseLevel}`
    );
  },
  getCourseByID(courseID) {
    return ApiService.apiAxios.get(`api/course/courseID/${courseID}`);
  },
  getCourseRestrictions() {
    return ApiService.apiAxios.get("/api/codes/courseRestrictions");
  },
  downloadCourseRestrictionsCSV() {
    return ApiService.apiAxios.get("/api/codes/courseRestrictions/download", {
      responseType: 'blob'
    });
  },
  waitForCacheRefresh() {
    return ApiService.apiAxios.post("/api/codes/courseRestrictions/waitForRefresh");
  },
  getCourseExaminableCourses() {
    return ApiService.apiAxios.get("/api/codes/examinableCourses");
  },
  downloadExaminableCoursesCSV() {
    return ApiService.apiAxios.get("/api/codes/examinableCourses/download", {
      responseType: 'blob'
    });
  },
  getCourseBlendingRules() {
    return ApiService.apiAxios.get(
      "/api/course/courseRestriction?mainCourseLevel=" +
        mainCourseLevel +
        "&mainCourseCode=" +
        mainCourseCode
    );
  },
  createCourseRestriction(json) {
    return ApiService.apiAxios.post(`/api/course/courseRestriction`, json);
  },
  updateCourseRestriction(restrictionId, json) {
    return ApiService.apiAxios.put(
      `/api/course/courseRestriction/` + restrictionId,
      json
    );
  },
  // IMPROVEMENT make this endpoint and service paginate with vuetify server data table
  getRuleCourseRequirements(rule) {
    return ApiService.apiAxios.get(
      "/api/course/requirementRule?rule=" + rule + "&pageNo=0&pageSize=2000"
    );
  },
  getCourseRequirements(params) {
    return ApiService.apiAxios.get("/api/course/courseRequirements?" + params);
  },
  getStudentCourseAchievements(pen) {
    return ApiService.apiAxios.get("/api/course/legacy/studentCourses/" + pen);
  },
  getStudentExamDetailsLegacy(pen) {
    return ApiService.apiAxios.get(
      "/api/course/legacy/studentExamDetails/" + pen
    );
  },
  getCourseEventHistory(params) {
    const encodedSortParams = encodeURIComponent(JSON.stringify(params.sort));
    const encodedSearchParams = encodeURIComponent(
      JSON.stringify(params.searchParams)
    );
    return ApiService.apiAxios.get(
      `/api/course/eventHistory?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}&searchParams=${encodedSearchParams}`
    );
  },
  putCourseEventHistory(json) {
    return ApiService.apiAxios.put("/api/course/eventHistory", json);
  },
};
