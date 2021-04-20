import axios from 'axios';

const apiClient = axios.create({
    baseURL: "/api/student-exams",
});

export default {
    getStudentExams(pen, token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
        //console.log("TOKEN IN SERVICE getStudentExams: " + token);
        return apiClient.get('/api/v1/studentexam/pen/' + pen,{ headers });
    }
};