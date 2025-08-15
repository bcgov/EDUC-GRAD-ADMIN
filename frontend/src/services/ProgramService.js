import ApiService from "../common/apiService";

export default {
  getAlgorithmRules() {
    return ApiService.apiAxios.get(`/api/program/algorithm/rules`);
  },
  getProgramRules() {
    return ApiService.apiAxios.get(`/api/program/gradProgram/rules`);
  },
  getProgramRule(programCode) {
    return ApiService.apiAxios.get(
      `/api/program/gradProgram/rules/${programCode}`
    );
  },
  getAllOptionalProgramRules() {
    return ApiService.apiAxios.get(`/api/program/optionalProgram/rules`);
  },
  getProgram(programCode) {
    return ApiService.apiAxios.get(`/api/program/gradProgram/${programCode}`);
  },
};
