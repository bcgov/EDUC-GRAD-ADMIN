import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
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
  getAlgorithmRules(token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/common/algorithmrules',{ headers});
  },
  getStudentNotes(pen, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token, "responseType": "arraybuffer" }
    return apiClient.get('/api/v1/common/studentnotes/pen/' + pen,{ headers });
  },
  addStudentNotes(json, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    return apiClient.post('/api/v1/common/studentnotes/', json, { headers});
  },
  deleteStudentNotes(noteID, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    return apiClient.delete('/api/v1/common/studentnotes/' + noteID, { headers});
  }
}
