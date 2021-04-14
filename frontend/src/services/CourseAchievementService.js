import axios from 'axios'
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_COURSE_ACHIEVEMENT_API_HOST,
})

export default {
  getStudentCourseAchievements(pen, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    //console.log("TOKEN IN SERVICE getStudentCourseAchievements: " + token);
    return apiClient.get('/api/v1/studentcourse/pen/' + pen,{ headers })
  },
  editStudentCourseAchievement(id, data, token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    //console.log("TOKEN IN SERVICE editStudentCourseAchievement: " + token);
    return apiClient.put("/api/v1/course-achievements/" + id ,data,{ headers })
  },
  addStudentCourseAchievement(data, token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
   // console.log("TOKEN IN SERVICE addStudentCourseAchievement: " + token);
    return apiClient.post("/api/v1/course-achievements/",data,{ headers })
  }
}
