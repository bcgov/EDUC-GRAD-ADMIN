import ApiService from "../common/apiService";
import { useAppStore } from '@/store/modules/app';

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
  // get a mincode from cache based on id
  schoolIdToMincode(schoolId) {
      const appStore = useAppStore();
      const schoolIdMap = new Map(
          appStore.getSchoolsList.map((school) => [school.schoolId, school])
      );
      return schoolIdMap.get(schoolId)?.mincode ?? null;
  },
};
