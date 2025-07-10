import ApiService from "../common/apiService";

export default {
  getStudentStatusCodes() {
    return ApiService.apiAxios.get("/api/codes/studentStatusCodes");
  },
  getStudentHistoryActivityCode() {
    return ApiService.apiAxios.get("/api/codes/studentHistoryActivityCodes");
  },
  getStudentGradeCodes() {
    return ApiService.apiAxios.get("/api/codes/studentGradeCodes");
  },
  getFineArtsAppliedSkillsTypes() {
    return ApiService.apiAxios.get("/api/codes/fineArtsAppliedSkillsCodes");
  },
  getExamSpecialCaseCodes() {
    return ApiService.apiAxios.get("/api/codes/examSpecialCaseCodes");
  },
  getEquivalentOrChallengeCodes() {
    return ApiService.apiAxios.get("/api/codes/equivalencyChallengeCodes");
  },
  getSchoolCategoryCodes() {
    return ApiService.apiAxios.get("/api/codes/schoolCategoryCodes");
  },
  getFacilityCodes() {
    return ApiService.apiAxios.get("/api/codes/schoolFacilityCodes");
  },
};
