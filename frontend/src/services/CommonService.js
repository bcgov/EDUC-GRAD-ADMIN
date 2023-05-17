import ApiService from '../common/apiService';

export default {
    getVersion() {
        return ApiService.apiAxios.get("/api/v1/version")
    }
};

