import ApiService from '../common/apiService';

export default {
    getVersion() {
        return ApiService.apiAxios.get("/api/v1/version")
    },

    getConfig() {
        return ApiService.apiAxios.get("/api/v1/config")
    }
};

