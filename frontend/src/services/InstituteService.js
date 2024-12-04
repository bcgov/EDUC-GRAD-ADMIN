import ApiService from "../common/apiService";

export default {
  getSchoolsList() {
    return ApiService.apiAxios.get("/api/v2/institute/schools/list");
  },
};
