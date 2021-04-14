import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_GRADUATION_API_HOST,
})
export default {
  graduateStudent(pen, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    return apiClient.get('/api/v1/graduate/pen/' + pen,{ headers });
  }
  
}