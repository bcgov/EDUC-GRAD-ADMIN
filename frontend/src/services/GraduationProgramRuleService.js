import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_PROGRAM_RULES_API_HOST
})

export default {
  getProgramRule(programCode, programSet, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json',"Access-Control-Allow-Origin": "*",'Authorization': 'Bearer '+ token }
    //console.log("TOKEN IN SERVICE getProgramRule: " + token);
    return apiClient.get('/api/v1/programmanagement/programrules?programCode=' + programCode + '&programSet=' + programSet,{ headers })
  }
}