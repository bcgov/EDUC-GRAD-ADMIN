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
  getGradProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/gradProgramCodes");
  },
  getOptionalProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/optionalProgramCodes");
  },
  getCareerProgramCodes() {
    return ApiService.apiAxios.get("/api/codes/careerProgramCodes");
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
};
