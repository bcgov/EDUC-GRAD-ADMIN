import ApiService from "../common/apiService";

export default {
  //TODO - Update this, not currently in use
  getSchoolsList() {
    return ApiService.apiAxios.get("/api/v1/institute/school");
  },
  getSchoolById(id) {
    return ApiService.apiAxios.get("/api/v1/institute/school/" + id);
  },
  getDistrictsList() {
    return ApiService.apiAxios.get("/api/v1/institute/district");
  },
  getDistrictById(id) {
    return ApiService.apiAxios.get("/api/v1/institute/district/" + id);
  },
};
