const passport = require("passport");
const express = require("express");
const router = express.Router();

const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getStudentStatusCodes,
  getHistoryActivityCodes,
  getStudentGradeCodes,
  downloadStudentGradeCodesCSV,
  getGradProgramCodes,
  downloadGradProgramCodesCSV,
  getOptionalProgramCodes,
  downloadOptionalProgramCodesCSV,
  getCareerProgramCodes,
  downloadCareerProgramCodesCSV,
  getCountryCodes,
  downloadCountryCodesCSV,
  getCitizenshipCodes,
  getProvinceCodes,
  getExaminableCourses,
  downloadExaminableCoursesCSV,
  getRequirementTypeCodes,
  getFineArtsAppliedSkillsCodes,
  getEquivalentOrChallengeCodes,
  getExamSpecialCaseCodes,
  getInstituteSchoolCategoryCodes,
  getInstituteFacilityCodes,
  getAssessmentSpecialCaseCodes,
  getCourseLetterGradeCodes,
  downloadLetterGradeCodesCSV,
  getTranscriptMessagingCodes,
  getStudentUndoCompletionReasonCodes,
  getTranscriptTypeCodes,
  getCertificateTypeCodes,
  getProgramCertificateTranscriptCodes,
  getReportTypeCodes,
  getDocumentStatusCodes,
  getDigitalSignatureBlockTypeCodes,
  getBatchJobTypes,
  getDigitalSignatures,
  saveDigitalSignature,
} = require("../components/codes");


const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR && SCHOLARSHIP_ADMIN",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
    roles.Admin.ScholarshipAdmin
  ]
);

router.get(
  "/studentStatusCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentStatusCodes
);

router.get(
  "/studentHistoryActivityCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getHistoryActivityCodes
);

router.get(
  "/studentGradeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentGradeCodes
);

router.get(
  "/studentGradeCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadStudentGradeCodesCSV
);

router.get(
  "/gradProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getGradProgramCodes
);

router.get(
  "/gradProgramCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadGradProgramCodesCSV
);

router.get(
  "/optionalProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getOptionalProgramCodes
);

router.get(
  "/optionalProgramCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadOptionalProgramCodesCSV
);

router.get(
  "/careerProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCareerProgramCodes
);

router.get(
  "/careerProgramCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadCareerProgramCodesCSV
);

router.get(
  "/requirementTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getRequirementTypeCodes
);

router.get(
  "/fineArtsAppliedSkillsCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getFineArtsAppliedSkillsCodes
);

router.get(
  "/equivalencyChallengeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getEquivalentOrChallengeCodes
);

router.get(
  "/examSpecialCaseCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getExamSpecialCaseCodes
);

router.get(
  "/schoolCategoryCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getInstituteSchoolCategoryCodes
);

router.get(
  "/schoolFacilityCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getInstituteFacilityCodes
);

router.get(
  "/assessmentSpecialCaseCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAssessmentSpecialCaseCodes
);

router.get(
  "/letterGradeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseLetterGradeCodes
);

router.get(
  "/letterGradeCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadLetterGradeCodesCSV
);

router.get(
  "/transcriptMessagingCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getTranscriptMessagingCodes
);

router.get(
  "/undoCompletionReasonCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentUndoCompletionReasonCodes
);

router.get(
  "/transcriptTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getTranscriptTypeCodes
);

router.get(
  "/certificateTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCertificateTypeCodes
);

router.get(
  "/programCertificateTranscriptCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getProgramCertificateTranscriptCodes
);

router.get(
  "/reportTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getReportTypeCodes
);

router.get(
  "/documentStatusCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getDocumentStatusCodes
);

router.get(
  "/signatureBlockTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getDigitalSignatureBlockTypeCodes
);

router.get(
  "/signatures",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getDigitalSignatures
);

router.post(
  "/signatures/save",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  saveDigitalSignature
);

router.get(
  "/batchJobTypes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchJobTypes
);

router.get(
  "/countryCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCountryCodes
);

router.get(
  "/countryCodes/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadCountryCodesCSV
);

router.get(
  "/citizenshipCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCitizenshipCodes
);

router.get(
  "/provinceCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getProvinceCodes
);

router.get(
  "/examinableCourses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getExaminableCourses
);

router.get(
  "/examinableCourses/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadExaminableCoursesCSV
);

module.exports = router;
