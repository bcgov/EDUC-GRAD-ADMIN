import ApiService from "../common/apiService";

// DEPRECATING - Remove file after student assessment CRUD is live
export default {
  getAllAssesments() {
    return ApiService.apiAxios.get("/api/assessment/assessments");
  },
  getAllAssesmentRequirements() {
    return ApiService.apiAxios.get("/api/assessment/requirements");
  },
  getRuleCourseRequirements(rule) {
    return ApiService.apiAxios.get("/api/assessment/requirements/rule/" + rule);
  },
  getStudentAssessmentLegacy(pen) {
    return ApiService.apiAxios.get("/api/assessment/studentAssessment/" + pen);
  },
};
