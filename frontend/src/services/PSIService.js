import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_PSI_API_HOST,
});

export default {
    getPSI(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
        //console.log("TOKEN IN SERVICE getGraduationPrograms: " + token);
        return apiClient.get('/api/v1/psi',{ headers });
    },
};

