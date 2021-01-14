import axios from 'axios';
var token = localStorage.getItem('jwt');
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_STUDENT_ASSESSMENTS_API_HOST,
})

export default {
    getStudentAssessment(pen) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
        //console.log("TOKEN IN SERVICE getStudentAssessment: " + token);
        return apiClient.get('/api/v1/studentassessment/pen/' + pen,{ headers });
    }
}