import ApiService from "../common/apiService";

export default {
  getSchoolsList() {
    return ApiService.apiAxios.get("/api/schools/allSchools");
  },
  getSchoolById(id) {
    return ApiService.apiAxios.get("/api/schools/school/" + id);
  },
  getDistrictsList() {
    return ApiService.apiAxios.get("/api/schools/allDistricts");
  },
  getDistrictById(id) {
    return ApiService.apiAxios.get("/api/schools/district/" + id);
  },

  // These still come from TRAX API (not TRAX itself, PSI reads from STS and event history reads from NATS listener in TRAX API)
  // Structure may change in future when TRAX API is decommissioned depending on what APIs they land in
  getPSIByAdvancedSearch(params) {
    return ApiService.apiAxios.get(
      "/api/schools/postSecondary/search?" + params
    );
  },
  getInstituteEventHistory(params) {
    const encodedSortParams = encodeURIComponent(JSON.stringify(params.sort));
    const encodedSearchParams = encodeURIComponent(
      JSON.stringify(params.searchParams)
    );
    return ApiService.apiAxios.get(
      `/api/schools/eventHistory?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}&searchParams=${encodedSearchParams}`
    );
  },
  putInstituteEventHistory(json) {
    return ApiService.apiAxios.put("/api/schools/eventHistory", json);
  },
};
