//Rename this service to GraduationReportService
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
})
export default {
  getAchievementReport(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token, "responseType": "arraybuffer" };
    return apiClient.get('/api/v1/graduationreports/studentreport/?studentID=' + id + '&reportType=ACHV',{ headers, responseType: 'arraybuffer'});
  },
  getStudentTranscripts(id, token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token, "responseType": "arraybuffer" };
    return apiClient.get('/api/v1/graduationreports/studenttranscript/' + id,{ headers});
  },
  getStudentReports(id,token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token, "responseType": "arraybuffer" };
    return apiClient.get('/api/v1/graduationreports/studentreport/' + id,{ headers });
  },
  getStudentCertificates(id, token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/graduationreports/studentcertificate/' + id,{ headers});
  },
  getCertificateTypes(token) {
      const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
      return apiClient.get('/api/v1/graduationreports/certificatetype',{ headers });
  },
  getTranscriptTypes(token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/graduationreports/transcripttype',{ headers });
  },  
  getProgramCertificateTranscripts(token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/graduationreports/allprogramcertificates',{ headers });
  },
  getReportTypes(token) {
      const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
      return apiClient.get('/api/v1/graduationreports/reporttype',{ headers });
  },
  getDocumentStatusCodes(token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/graduationreports/documentstatus',{ headers });
  },
  getStudentXmlReport(id, token){
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/graduate/report/transcript/' + id + '?interim=Interim',{ headers });
  }, 
  getDigitalSignatures(token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/signatures/get/all',{ headers });   
  },
  getDigitalSignaturesBlockTypes(token) {
    const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
    return apiClient.get('/api/v1/signatures/getSignatureBlockTypeCodes',{ headers });
  }
};
