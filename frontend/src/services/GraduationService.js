import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
})
export default {
  graduateStudent(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    return apiClient.get('/api/v1/graduate/studentid/' + id + '/run/GS',{ headers });
  },
  projectedGradFinalMarks(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    return apiClient.get('/api/v1/graduate/studentid/' + id + '/run/FM',{ headers });
  },
  projectedGradStatusWithFinalAndReg(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    return apiClient.get('/api/v1/graduate/studentid/' + id + '/run/REGFM',{ headers });
  },
  updateStudentReports(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    return apiClient.get('/api/v1/graduate/studentid/' + id + '/run/FMR',{ headers });
  }
}