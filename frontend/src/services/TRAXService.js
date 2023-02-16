import ApiService from '../common/apiService';

export default {
    getPSIByAdvanceSearch(params) {
        return ApiService.apiAxios.get('/api/v1/trax/psi/search?'  + params)
    },
    getDistrict(district){
        return ApiService.apiAxios.get('/api/v1/trax/district/'  + district)
    }
};

