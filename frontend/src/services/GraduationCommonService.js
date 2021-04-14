import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_GRADUATION_COMMON_API_HOST,
})
export default {
  getAchievementReport(pen, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token, "responseType": "arraybuffer" }
    return apiClient.get('/api/v1/common/studentreport/?pen=' + pen + '&reportType=ACHV',{ headers, responseType: 'arraybuffer'});
  },
  getStudentTranscript(pen, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token, "responseType": "arraybuffer" }
    return apiClient.get('/api/v1/common/studentreport/?pen=' + pen + '&reportType=TRAN',{ headers, responseType: 'arraybuffer'});
  },
}
