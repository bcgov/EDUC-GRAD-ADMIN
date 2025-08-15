import ApiService from "../common/apiService";

export default {
  getConfig() {
    return ApiService.apiAxios.get("/api/config");
  },
};
