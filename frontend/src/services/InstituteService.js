import ApiService from "../common/apiService";

export default {
  //TODO - Update this, not currently in use
  getSchoolsList() {
    return ApiService.apiAxios.get("/api/v2/institute/schools/list");
  },
  getDistrictList() {
    return ApiService.apiAxios.get("/api/v1/institute/district");
  },
  getSchoolById(id) {
    return ApiService.apiAxios.get("/api/v1/institute/school/" + id);
  },
};
