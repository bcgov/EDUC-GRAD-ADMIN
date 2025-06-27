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
};
