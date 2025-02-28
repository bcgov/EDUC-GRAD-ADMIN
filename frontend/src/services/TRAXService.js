import ApiService from "../common/apiService";

export default {
  getPSIByAdvancedSearch(params) {
    return ApiService.apiAxios.get("/api/v1/trax/psi/search?" + params);
  },
  getDistrict(district) {
    return ApiService.apiAxios.get("/api/v1/trax/district/" + district);
  },
  // TODO: Review this when we implement batch filtering in GRAD2-2553
  getInstituteEventHistory(params) {
    const encodedSortParams = encodeURIComponent(JSON.stringify(params.sort));
    const encodedSearchParams = encodeURIComponent(
      JSON.stringify(params.searchParams)
    );
    console.log(params.pageSize);
    return ApiService.apiAxios.get(
      `/api/v1/trax/event/history/paginated?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}&searchParams=${encodedSearchParams}`
    );
  },
  putInstituteEventHistory(json) {
    return ApiService.apiAxios.put("/api/v1/trax/event/history", json);
  },
};
