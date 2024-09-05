import ApiService from "../common/apiService";

export default {
  getPSIByAdvancedSearch(params) {
    return ApiService.apiAxios.get("/api/v2/trax/psi/search/" + params);
  },
  getDistrict(district) {
    return ApiService.apiAxios.get("/api/v2/trax/district/" + district);
  },
};
