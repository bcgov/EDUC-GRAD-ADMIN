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

  // GET Institute Codes
  getAddressTypeCodes() {
    return ApiService.apiAxios.get("/api/v1/institute/address-type-codes");
  },
  getSchoolCategoryCodes() {
    return ApiService.apiAxios.get("/api/v1/institute/category-codes");
  },
  getFacilityCodes() {
    return ApiService.apiAxios.get("/api/v1/institute/facility-codes");
  },
  getGradeCodes() {
    return ApiService.apiAxios.get("/api/v1/institute/grade-codes");
  },
};
