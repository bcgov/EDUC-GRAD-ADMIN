import ApiService from '../common/apiService';

export default {
  getAchievementReport(id) {
    return ApiService.apiAxios.get('/api/v1/graduationreports/studentreport/?studentID=' + id + '&reportType=ACHV')
  },
  getAllReportsForSchool(id) {
    return ApiService.apiAxios.get('/api/v1/graduationreports/schoolreport/' + id);
  },
  getStudentTranscripts(id) {
    return ApiService.apiAxios.get('/api/v1/graduationreports/studenttranscript/' + id)
  },
  getStudentReports(id){
    return ApiService.apiAxios.get('/api/v1/graduationreports/studentreport/' + id)
  },
  getStudentCertificates(id){
    return ApiService.apiAxios.get('/api/v1/graduationreports/studentcertificate/' + id)
  },
  getCertificateTypes() {
    return ApiService.apiAxios.get('/api/v1/graduationreports/certificatetype')
  },
  getTranscriptTypes() {
    return ApiService.apiAxios.get('/api/v1/graduationreports/transcripttype')
  },  
  getProgramCertificateTranscripts(){
    return ApiService.apiAxios.get('/api/v1/graduationreports/allprogramcertificates')
  },
  getReportTypes() {
    return ApiService.apiAxios.get('/api/v1/graduationreports/reporttype')
  },
  getDocumentStatusCodes() {
    return ApiService.apiAxios.get('/api/v1/graduationreports/documentstatus')
  },
  getStudentXmlReport(id){
    return ApiService.apiAxios.get('/api/v1/graduate/report/transcript/' + id + '?interim=Interim&preview=true')
  }, 
  getDigitalSignatures() {
    return ApiService.apiAxios.get('/api/v1/reports/signatures/get/all')
  },
  getDigitalSignaturesBlockTypes() {
    return ApiService.apiAxios.get('/api/v1/reports/signatures/getSignatureBlockTypeCodes')
  },

};
