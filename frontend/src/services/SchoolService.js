import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
});

export default {
    getSchoolInfo(mincode, token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/trax/school/' + mincode,{ headers });
    },
    getAllSchools(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/trax/school/',{ headers });
    },
    searchSchools(searchInput, token) {
        
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        let queryString = ""
        for (var key in searchInput) {
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
        return apiClient.get('/api/v1/trax/school/search?' + queryString,{ headers });
    }
};
