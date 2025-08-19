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
  postBatchProcessingRoutineToggle,
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
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

// BATCH HISTORY
router.get(
  "/history",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getBatchHistoryDashboard
);

router.get(
  "/history/errors/:batchID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getBatchHistoryErrors
);

// should not be a GET
router.get(
  "/history/:batchID/schoolReport/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRerunSchoolReports
);

// should not be a GET
router.get(
  "/history/:batchID/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRerunBatch
);

// should not be a GET
router.get(
  "/history/:batchID/failed/rerun",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRerunFailed
);

// BATCH USER SCHEDULED JOBS
router.get(
  "/scheduledJobs",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getBatchScheduledJobs
);

router.post(
  "/scheduledJobs/:jobTypeCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postCreateScheduledJob
);

router.delete(
  "/scheduledJobs/:jobID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  deleteScheduledJob
);

// BATCH ROUTINES
router.get(
  "/routines",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getBatchProcessingRoutines
);

router.post(
  "/routines/toggle/:jobType",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postBatchProcessingRoutineToggle
);

// NEW BATCH REQUESTS
router.post(
  "/run/graduation/regularAlgorithm",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postRegularGraduationAlgorithmBatch
);

router.post(
  "/run/graduation/TVR",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postTranscriptVerificationReportBatch
);

router.post(
  "/run/graduation/distribution",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postMonthlyDistributionRun
);

// OT Transcript - Original transcript?
router.post(
  "/run/userRequest/distribution/originalTranscript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestDistributionOriginalTranscript
);

// OC Original Certificate w/principal signature block
router.post(
  "/run/userRequest/distribution/originalCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestDistributionOriginalCertificate
);

// RC Reprint Certificate - no principal signature block
router.post(
  "/run/userRequest/distribution/reprintCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestDistributionReprintCertificate
);

router.post(
  "/run/userRequest/distribution/blankCertificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestBlankCertificate
);

router.post(
  "/run/userRequest/distribution/blankTranscript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestBlankTranscript
);

router.post(
  "/run/regeneration/schoolReport",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestRegenSchoolReport
);

router.post(
  "/run/regeneration/certificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postUserRequestRegenCertificate
);

router.post(
  "/run/yearEnd/PSI/:transmissionType",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postYearEndPSIRun
);
router.post(
  "/run/yearEnd/distribution/nonGraduate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postNonGraduateTranscriptDistributionRun
);
// Year end credentials and transcript
router.post(
  "/run/yearEnd/distribution/credentials",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postYearEndCredentialsDistributionRun
);

router.post(
  "/run/yearEnd/TVRDelete",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postYearEndTVRDelete
);

router.post(
  "/run/yearEnd/ArchiveStudents",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postArchiveStudents
);

router.post(
  "/run/yearEnd/ArchiveSchoolReports",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postArchiveSchoolReports
);

// DIStRIBUTION
router.get(
  "/distribution/download/:batchID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getUserDistributionDownload
);

module.exports = router;
