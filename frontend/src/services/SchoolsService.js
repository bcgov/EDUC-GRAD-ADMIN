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

  // These still come from TRAX API need to be reviewed in the future when it's decommissioned
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
    console.log(params.pageSize);
    return ApiService.apiAxios.get(
      `/api/schools/eventHistory?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sort=${encodedSortParams}&searchParams=${encodedSearchParams}`
    );
  },
  putInstituteEventHistory(json) {
    return ApiService.apiAxios.put("/api/schools/eventHistory", json);
  },
};
