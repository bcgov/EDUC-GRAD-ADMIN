import ApiService from "../common/apiService";

export default {
  getStudentStatusCodes() {
    return ApiService.apiAxios.get("/api/codes/studentStatusCodes");
  },
  getStudentHistoryActivityCode() {
    return ApiService.apiAxios.get("/api/codes/studentHistoryActivityCodes");
  },
  getStudentGradeCodes() {
    return ApiService.apiAxios.get("/api/codes/studentGradeCodes");
  },
  downloadStudentGradeCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/studentGradeCodes/download", {
      responseType: 'blob'
    });
  },
  getGradProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/gradProgramCodes");
  },
  downloadGradProgramCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/gradProgramCodes/download", {
      responseType: 'blob'
    });
  },
  getOptionalProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/optionalProgramCodes");
  },
  downloadOptionalProgramCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/optionalProgramCodes/download", {
      responseType: 'blob'
    });
  },
  getCareerProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/careerProgramCodes");
  },
  downloadCareerProgramCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/careerProgramCodes/download", {
      responseType: 'blob'
    });
  },
  getCountryCodes() {
    return ApiService.apiAxios.get("/api/codes/countryCodes");
  },
  downloadCountryCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/countryCodes/download", {
      responseType: 'blob'
    });
  },
  getCitizenshipCodes() {
    return ApiService.apiAxios.get("/api/codes/citizenshipCodes");
  },
  getProvinceCodes() {
    return ApiService.apiAxios.get("/api/codes/provinceCodes");
  },
  getRequirementTypeCodes() {
    return ApiService.apiAxios.get("/api/codes/requirementTypeCodes");
  },
  getFineArtsAppliedSkillsTypes() {
    return ApiService.apiAxios.get("/api/codes/fineArtsAppliedSkillsCodes");
  },
  getExamSpecialCaseCodes() {
    return ApiService.apiAxios.get("/api/codes/examSpecialCaseCodes");
  },
  getEquivalentOrChallengeCodes() {
    return ApiService.apiAxios.get("/api/codes/equivalencyChallengeCodes");
  },
  getSchoolCategoryCodes() {
    return ApiService.apiAxios.get("/api/codes/schoolCategoryCodes");
  },
  getFacilityCodes() {
    return ApiService.apiAxios.get("/api/codes/schoolFacilityCodes");
  },
  getLetterGradeCodes() {
    return ApiService.apiAxios.get("/api/codes/letterGradeCodes");
  },
  downloadLetterGradeCodesCSV() {
    return ApiService.apiAxios.get("/api/codes/letterGradeCodes/download", {
      responseType: 'blob'
    });
  },
  getSpecialCaseCodes() {
    return ApiService.apiAxios.get("/api/codes/assessmentSpecialCaseCodes");
  },
  getTranscriptMessageCodes() {
    return ApiService.apiAxios.get("/api/codes/transcriptMessagingCodes");
  },
  getAlgorithmRulesCodes() {
    return ApiService.apiAxios.get("/api/codes/algorithmRulesCodes");
  },
  getUndoCompletionReasonCodes() {
    return ApiService.apiAxios.get("/api/codes/undoCompletionReasonCodes");
  },
  getTranscriptTypeCodes() {
    return ApiService.apiAxios.get("/api/codes/transcriptTypeCodes");
  },
  getCertificateTypeCodes() {
    return ApiService.apiAxios.get("/api/codes/certificateTypeCodes");
  },
  getProgramCertificateTranscriptCodes() {
    return ApiService.apiAxios.get(
      "/api/codes/programCertificateTranscriptCodes"
    );
  },
  getReportTypeCodes() {
    return ApiService.apiAxios.get("/api/codes/reportTypeCodes");
  },
  getDocumentStatusCodes() {
    return ApiService.apiAxios.get("/api/codes/documentStatusCodes");
  },
  getDigitalSignatureBlockTypeCodes() {
    return ApiService.apiAxios.get("/api/codes/signatureBlockTypeCodes");
  },
  getBatchJobTypes() {
    return ApiService.apiAxios.get("/api/codes/batchJobTypes");
  },
};
