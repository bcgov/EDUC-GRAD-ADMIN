const passport = require("passport");
const express = require("express");
const router = express.Router();

const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getStudentStatusCodes,
  getHistoryActivityCodes,
  getStudentGradeCodes,
  getGradProgramCodes,
  getOptionalProgramCodes,
  getCareerProgramCodes,
  getRequirementTypeCodes,
  getFineArtsAppliedSkillsCodes,
  getEquivalentOrChallengeCodes,
  getExamSpecialCaseCodes,
  getInstituteSchoolCategoryCodes,
  getInstituteFacilityCodes,
  getAssessmentSpecialCaseCodes,
  getCourseLetterGradeCodes,
  getTranscriptMessagingCodes,
  getStudentUndoCompletionReasonCodes,
  getTranscriptTypeCodes,
  getCertificateTypeCodes,
  getProgramCertificateTranscriptCodes,
  getReportTypeCodes,
  getDocumentStatusCodes,
  getDigitalSignatureBlockTypeCodes,
  getBatchJobTypes,
} = require("../components/codes");

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
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
  "/gradProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getGradProgramCodes
);

router.get(
  "/optionalProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getOptionalProgramCodes
);

router.get(
  "/careerProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCareerProgramCodes
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
  "/batchJobTypes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchJobTypes
);

module.exports = router;
