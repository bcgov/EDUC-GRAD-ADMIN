import ApiService from "../common/apiService";

export default {
  getPSIByAdvancedSearch(params) {
    return ApiService.apiAxios.get("/api/v1/trax/psi/search?" + params);
  },
  getDistrict(district) {
    return ApiService.apiAxios.get("/api/v1/trax/district/" + district);
  },
  getInstituteEventHistory(params) {
    return ApiService.apiAxios.get(
      "/api/v1/trax/event/history/paginated?" + params
    );
  },
  putInstituteEventHistory(json) {
    return ApiService.apiAxios.put("/api/v1/trax/event/history", json);
  },
};
