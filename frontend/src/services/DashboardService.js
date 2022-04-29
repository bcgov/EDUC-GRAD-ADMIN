import axios from "axios";
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

export default {
    getDashboardInfo(token) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*.gov.bc.ca",
        Authorization: "Bearer " + token,
      }
      return apiClient.get("/api/v1/batch/dashboard", { headers });
    },
    //Run Regualar Algorithm for users
    runREGALG(token,users) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*.gov.bc.ca",
        Authorization: "Bearer " + token,
      };
      return apiClient.post("/api/v1/batch/specialrun", users, { headers });
    },
    runTVRRUN(token,users) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*.gov.bc.ca",
        Authorization: "Bearer " + token,
      };
      return apiClient.post("/api/v1/batch/tvrspecialrun", users, { headers });
    },
    runDISTRUN(token,users,credentialType) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*.gov.bc.ca",
        Authorization: "Bearer " + token,
      };
      if(credentialType == "OT"){
        return apiClient.post("/api/v1/batch/userrequestdisrun/OT", users, { headers });
      }else if(credentialType == "OC"){
        return apiClient.post("/api/v1/batch/userrequestdisrun/OC", users, { headers });
      }
      
    },        
    runOriginalCertificateDISTRUN(token,users) {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*.gov.bc.ca",
        Authorization: "Bearer " + token,
      };
      return apiClient.post("/api/v1/batch/userrequestdisrun/OC", users, { headers });
    },            
    getBatchErrors(id, page, token) {
      const headers = { Accept: 'application/json','Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization': 'Bearer '+ token }
      return apiClient.get('/api/v1/batch/dashboard/errors/' + id + '?pageNumber=' + page,{ headers });
    },
    getBatchSummary(token) {
      const headers = { Accept: 'application/json','Content-Type': 'application/json','Access-Control-Allow-Origin': '*','Authorization': 'Bearer '+ token }
      return apiClient.get('/api/v1/batch/dashboard/summary',{ headers });
    },
    
}