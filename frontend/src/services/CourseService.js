import ApiService from "../common/apiService";

export default {
  getCoursesByAdvanceSearch(params) {
    return ApiService.apiAxios.get("/api/v1/course/coursesearch?" + params);
  },
  getCourses(courseCode) {
    return ApiService.apiAxios.get("/api/v1/course/" + courseCode);
  },
  getCourseByCodeAndLevel(courseCode, courseLevel){
    return ApiService.apiAxios.get(`/api/v2/course?courseCode=${courseCode}&courseLevel=${courseLevel}`);
  },
  getAllCourses() {
    return ApiService.apiAxios.get("/api/v1/course/");
  },
  getAllCourseRequirements() {
    return ApiService.apiAxios.get("/api/v1/course/requirement");
  },
  getCourseRestrictions() {
    return ApiService.apiAxios.get("/api/v1/course/restriction");
  },
   getCourseExaminableCourses() {
    return ApiService.apiAxios.get("/api/v1/course/examinablecourses");
  },
  getCourseRestriction(mainCourseLevel, mainCourseCode) {
    return ApiService.apiAxios.get(
      "/api/v1/course/courserestrictionsearch?mainCourseLevel=" +
        mainCourseLevel +
        "&mainCourseCode=" +
        mainCourseCode
    );
  },
  createCourseRestriction(json) {
      return ApiService.apiAxios.post(
        `/api/v2/course/save-course-restriction`,
        json
      );
  },
  updateCourseRestriction(restrictionId, json) {
      return ApiService.apiAxios.put(
        `/api/v2/course/save-course-restriction/` + restrictionId,
        json
      );
  },  
  getRuleCourseRequirements(rule) {
    return ApiService.apiAxios.get(
      "/api/v1/course/requirement/rule?rule=" + rule + "&pageNo=0&pageSize=2000"
    );
  },
  getCourseRequirements(params) {
    return ApiService.apiAxios.get(
      "/api/v1/course/courserequirementsearch?" + params
    );
  },
  getStudentCourseAchievements(pen) {
    return ApiService.apiAxios.get(
      "/api/v1/course/studentcourse/pen/" + pen + "?sortForUI=true"
    );
  },
  getStudentExamDetailsLegacy(pen) {
    return ApiService.apiAxios.get(
      "/api/v1/course/studentexam/pen/" + pen + "?sortForUI=true"
    );
  },
  getFineArtsAppliedSkillsTypes() {
    return ApiService.apiAxios.get("/api/v1/course/fineArtsAppliedSkillsCodes");
  },
  getExamSpecialCaseCodes() {
    return ApiService.apiAxios.get("/api/v1/course/examSpecialCaseCodes");
  },
  getEquivalentOrChallengeCodes() {
    return ApiService.apiAxios.get("/api/v1/course/equivalentOrChallengeCodes");
  },
};
