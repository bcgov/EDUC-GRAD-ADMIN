import ApiService from "../common/apiService";

export default {
  getSchoolReportsById(schoolID) {
    return ApiService.apiAxios.get(
      `/api/reports/schoolReports/school/${schoolID}`
    );
  },
  getReportsByDistrictId(districtID) {
    return ApiService.apiAxios.get(
      `/api/reports/schoolReports/district/${districtID}`
    );
  },
};
