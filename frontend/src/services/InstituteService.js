import ApiService from "../common/apiService";

export default {
  getSchoolsList() {
    return ApiService.apiAxios.get("/api/v1/institute/schools/list");
  },
  getDistrictList() {
    return ApiService.apiAxios.get("/api/v1/institute/district");
  },
  getSchoolById(id) {
    return ApiService.apiAxios.get("/api/v1/institute/school/" + id);
  },
};
