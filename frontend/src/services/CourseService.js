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
  getAllCourseRequirements() {
    return ApiService.apiAxios.get("/api/course/courseRequirements");
  },
  getCourseRestrictions() {
    return ApiService.apiAxios.get("/api/course/courseRestrictions");
  },
  getCourseExaminableCourses() {
    return ApiService.apiAxios.get("/api/course/examinableCourseSessions");
  },
  getCourseRestriction(mainCourseLevel, mainCourseCode) {
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
};
