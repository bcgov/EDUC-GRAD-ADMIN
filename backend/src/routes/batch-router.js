const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getBatchHistoryDashboard,
  getBatchHistoryErrors,
  getRerunSchoolReports,
  getRerunBatch,
  getRerunFailed,
  getBatchScheduledJobs,
  postCreateScheduledJob,
  deleteScheduledJob,
  getBatchProcessingRoutines,
  putBatchProcessingRoutineToggle,
  postRegularGraduationAlgorithmBatch,
  postTranscriptVerificationReportBatch,
  postMonthlyDistributionRun,
  postUserRequestDistributionOriginalTranscript,
  postUserRequestDistributionOriginalCertificate,
  postUserRequestDistributionReprintCertificate,
  postUserRequestBlankCertificate,
  postUserRequestBlankTranscript,
  postUserRequestRegenSchoolReport,
  postUserRequestRegenCertificate,
  postYearEndPSIRun,
  postNonGraduateTranscriptDistributionRun,
  postYearEndCredentialsDistributionRun,
  postYearEndTVRDelete,
  postArchiveStudents,
  postArchiveSchoolReports,
  getUserDistributionDownload,
} = require("../components/batch");
const { request } = require("../app");
const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

const isValidUiTokenWithStaffUpdateRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [roles.Admin.StaffInfoOfficer, roles.Admin.StaffAdministration]
);

// BATCH HISTORY
router.get(
  "/history",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchHistoryDashboard
);

router.get(
  "/history/errors/:batchID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchHistoryErrors
);

// should not be a GET
router.get(
  "/history/:batchID/schoolReport/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getRerunSchoolReports
);

// should not be a GET
router.get(
  "/history/:batchID/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getRerunBatch
);

// should not be a GET
router.get(
  "/history/:batchID/failed/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getRerunFailed
);

// BATCH USER SCHEDULED JOBS
router.get(
  "/scheduledJobs",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchScheduledJobs
);

router.post(
  "/scheduledJobs/:jobTypeCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postCreateScheduledJob
);

router.delete(
  "/scheduledJobs/:jobID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  deleteScheduledJob
);

// BATCH ROUTINES
router.get(
  "/routines",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getBatchProcessingRoutines
);

router.put(
  "/routines/toggle/:jobType",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  putBatchProcessingRoutineToggle
);

// NEW BATCH REQUESTS
router.post(
  "/run/graduation/regularAlgorithm",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postRegularGraduationAlgorithmBatch
);

router.post(
  "/run/graduation/TVR",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postTranscriptVerificationReportBatch
);

router.post(
  "/run/graduation/distribution",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postMonthlyDistributionRun
);

// OT Transcript - Original transcript?
router.post(
  "/run/userRequest/distribution/originalTranscript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestDistributionOriginalTranscript
);

// OC Original Certificate w/principal signature block
router.post(
  "/run/userRequest/distribution/originalCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestDistributionOriginalCertificate
);

// RC Reprint Certificate - no principal signature block
router.post(
  "/run/userRequest/distribution/reprintCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestDistributionReprintCertificate
);

router.post(
  "/run/userRequest/distribution/blankCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestBlankCertificate
);

router.post(
  "/run/userRequest/distribution/blankTranscript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestBlankTranscript
);

router.post(
  "/run/regeneration/schoolReport",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestRegenSchoolReport
);

router.post(
  "/run/regeneration/certificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postUserRequestRegenCertificate
);

router.post(
  "/run/yearEnd/PSI/:transmissionType",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postYearEndPSIRun
);
router.post(
  "/run/yearEnd/distribution/nonGraduate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postNonGraduateTranscriptDistributionRun
);
// Year end credentials and transcript
router.post(
  "/run/yearEnd/distribution/credentials",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postYearEndCredentialsDistributionRun
);

router.post(
  "/run/yearEnd/TVRDelete",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postYearEndTVRDelete
);

router.post(
  "/run/yearEnd/ArchiveStudents",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postArchiveStudents
);

router.post(
  "/run/yearEnd/ArchiveSchoolReports",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffUpdateRoles,
  postArchiveSchoolReports
);

// DIStRIBUTION
router.get(
  "/distribution/download/:batchID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getUserDistributionDownload
);

module.exports = router;
