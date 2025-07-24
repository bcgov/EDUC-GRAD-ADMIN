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
} = require("../components/codes");

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  "/studentStatusCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentStatusCodes
);

router.get(
  "/studentHistoryActivityCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getHistoryActivityCodes
);

router.get(
  "/studentGradeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentGradeCodes
);

router.get(
  "/gradProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGradProgramCodes
);

router.get(
  "/optionalProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getOptionalProgramCodes
);

router.get(
  "/careerProgramCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCareerProgramCodes
);

router.get(
  "/requirementTypeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRequirementTypeCodes
);

router.get(
  "/fineArtsAppliedSkillsCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getFineArtsAppliedSkillsCodes
);

router.get(
  "/equivalencyChallengeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getEquivalentOrChallengeCodes
);

router.get(
  "/examSpecialCaseCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getExamSpecialCaseCodes
);

router.get(
  "/schoolCategoryCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getInstituteSchoolCategoryCodes
);

router.get(
  "/schoolFacilityCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getInstituteFacilityCodes
);

router.get(
  "/assessmentSpecialCaseCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAssessmentSpecialCaseCodes
);

router.get(
  "/letterGradeCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseLetterGradeCodes
);

router.get(
  "/transcriptMessagingCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getTranscriptMessagingCodes
);

router.get(
  "/undoCompletionReasonCodes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentUndoCompletionReasonCodes
);

module.exports = router;
