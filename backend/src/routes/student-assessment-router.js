const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const passport = require("passport");
const validate = require("../components/validator");
const {
  putStudentAssessmentSchema,
  postStudentAssessmentSchema,
  deleteStudentAssessmentSchema,
  getPaginatedStudentAssessmentSchema,
  postTransferStudentAssessmentSchema
} = require("../components/validations/student-assessment");
const {
  getStudentAssessmentById,
  getStudentAssessmentPaginated,
  updateStudentAssessmentById,
  postStudentAssessment,
  deleteStudentAssessmentByID,
  getAssessmentTypeCodes,
  getAllAssessmentSessions,
  getProvincialSpecialCaseCodes,
  getStudentAssessmentHistoryPaginated,
  getStudentAssessmentByIdAndAssessmentId,
  transferStudentAssessments,
  getAssessmentStudentSearchReport
} = require("../components/assessments/student-assessment");

const isValidUiTokenWithStaffEditRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffAdministration,
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffGradAssessments,
  ]
);

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR && SCHOLARSHIP_ADMIN",
  [
    roles.Admin.StaffAdministration,
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffGradAssessments,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.ScholarshipAdmin
  ]
);

router.get(
  "/assessment-type-codes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAssessmentTypeCodes
);

router.get(
  "/provincial-special-case-codes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getProvincialSpecialCaseCodes
);

router.get(
  "/student/paginated",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  validate(getPaginatedStudentAssessmentSchema),
  getStudentAssessmentPaginated
);

router.get(
  "/student-history/paginated",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  validate(getPaginatedStudentAssessmentSchema),
  getStudentAssessmentHistoryPaginated
);

router.get(
  "/student/:studentAssessmentId",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentAssessmentById
);

router.get(
  "/student/:studentAssessmentId/assessment/:assessmentId",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentAssessmentByIdAndAssessmentId
);

router.put(
  "/student/:studentAssessmentId",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffEditRoles,
  validate(putStudentAssessmentSchema),
  updateStudentAssessmentById
);

router.post(
  "/student",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffEditRoles,
  validate(postStudentAssessmentSchema),
  postStudentAssessment
);

router.delete(
  "/student/:studentAssessmentId",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffEditRoles,
  validate(deleteStudentAssessmentSchema),
  deleteStudentAssessmentByID
);

router.get(
  "/sessions",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAllAssessmentSessions
);

router.post(
  "/transfer",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffEditRoles,
  validate(postTransferStudentAssessmentSchema),
  transferStudentAssessments
);

router.get(
  "/report/assessment-students/search/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAssessmentStudentSearchReport
);

module.exports = router;
