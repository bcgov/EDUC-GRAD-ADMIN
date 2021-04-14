import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_STUDENT_EXAMS_API_HOST,
});

export default {
    getStudentExams(pen, token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
        //console.log("TOKEN IN SERVICE getStudentExams: " + token);
        return apiClient.get('/api/v1/studentexam/pen/' + pen,{ headers });
    }
};