import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://grad-admin-77c02f-tools.apps.silver.devops.gov.bc.ca/api/studentexam",
});

export default {
    getStudentExams(pen, token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
        //console.log("TOKEN IN SERVICE getStudentExams: " + token);
        return apiClient.get('/api/v1/studentexam/pen/' + pen,{ headers });
    }
};