import ApiService from "../common/apiService";

export default {
  getPSIByAdvancedSearch(params) {
    return ApiService.apiAxios.get("/api/v1/trax/psi/search?" + params);
  },
  getDistrict(district) {
    return ApiService.apiAxios.get("/api/v1/trax/district/" + district);
  },
  // Note: Sort is currently hard coded in the URL, however we'll want to update this when we tackle sorting & filtering in a future ticket
  getInstituteEventHistory(params) {
    return ApiService.apiAxios.get(
      "/api/v1/trax/event/history/paginated?" +
        params +
        "&sort=%7B%22createDate%22%3A%22DEC%22%7D"
    );
  },
  putInstituteEventHistory(json) {
    return ApiService.apiAxios.put("/api/v1/trax/event/history", json);
  },
};
