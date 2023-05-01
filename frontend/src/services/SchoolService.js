import ApiService from '../common/apiService';

export default {
    getSchoolInfo(mincode) {
        return ApiService.apiAxios.get('/api/v1/trax/school/' + mincode)
    },
    searchSchools(searchInput) {
        
        let queryString = ""
        for (const key in searchInput) {
            if (searchInput.hasOwnProperty(key)) {
                if(searchInput[key].value){
                    let contains = (searchInput[key].contains) ? "*":"";
                    queryString 
                        += key 
                        + "=" 
                        + searchInput[key].value
                        + contains
                        + "&";
                }
            }
        }
        queryString = queryString.slice(0, -1); //remove trailing ampersand
        return ApiService.apiAxios.get('/api/v1/trax/school/search?' + queryString)
    }
};
