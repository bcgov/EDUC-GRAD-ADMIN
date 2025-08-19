const passport = require("passport");
const express = require("express");
const router = express.Router();
const validate = require('../components/validator');
const {
  postStudentCourseSchema,
  putStudentCourseSchema,
  deleteStudentCourseSchema,
  postTransferStudentCourseSchema
} = require('../components/validations/student-course');
const { postAdoptStudentSchema } = require('../components/validations/grad-student');
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getStudentCourseByStudentID,
  putStudentCoursesByStudentID,
  postStudentCoursesByStudentID,
  deleteStudentCoursesByStudentID,
  transferStudentCoursesByStudentID,
  getStudentCourseHistory,
  getStudentCareerPrograms,
  postStudentCareerProgram,
  deleteStudentCareerProgram,
  getStudentOptionalPrograms,
  postStudentOptionalProgram,
  deleteStudentOptionalProgram,
  getStudentGradStatusHistory,
  getStudentOptionalProgramHistory,
  getBatchHistoryStudents,
  getStudentGradStatus,
  postStudentGradStatus,
  getStudentUndoCompletion,
  postStudentUndoCompletion,
  getRunGradAlgorithm,
  getRunPreviewFinalMarks,
  getRunTranscriptVerification,
  getRunUpdateTranscript,
  getStudentTranscript,
  getStudentTVR,
  getStudentCertificate,
  getStudentXMLReport,
  getStudentNotes,
  postStudentNotes,
  deleteStudentNotes,
  getStudentAdvancedSearch,
  getStudentByPen,
  getStudentByID,
  postAdoptPENStudent,
} = require("../components/student");

const isValidUiTokenWithEditStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

// STUDENT COURSES
router.get(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCourseByStudentID,
);

router.put(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(putStudentCourseSchema),
  putStudentCoursesByStudentID
);

router.post(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(postStudentCourseSchema),
  postStudentCoursesByStudentID
);

router.post(
  "/:sourceStudentID/courses/transfer/:targetStudentID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(postTransferStudentCourseSchema),
  transferStudentCoursesByStudentID
);

router.delete(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(deleteStudentCourseSchema),
  deleteStudentCoursesByStudentID
);

router.get(
  "/:studentID/history/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCourseHistory
);

// STUDENT OPTIONAL AND CAREER PROGRAMS
router.post(
  "/:studentID/optionalPrograms/:optionalProgramID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  postStudentOptionalProgram
);

router.delete(
  "/:studentID/optionalPrograms/:optionalProgramID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  deleteStudentOptionalProgram
);

router.get(
  "/:studentID/optionalPrograms/status",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentOptionalPrograms
);

router.get(
  "/:studentID/careerPrograms",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCareerPrograms
);

router.post(
  "/:studentID/careerPrograms",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  postStudentCareerProgram
);

router.delete(
  "/:studentID/careerPrograms/:careerProgramCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  deleteStudentCareerProgram
);

// STUDENT HISTORY
router.get(
  "/:studentID/gradProgram/history",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentGradStatusHistory
);

router.get(
  "/:studentID/optionalPrograms/history",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentOptionalProgramHistory
);

router.get(
  "/batchHistory/:batchID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getBatchHistoryStudents
);

// STUDENT GRAD PROGRAM
router.get(
  "/:studentID/gradProgram/status",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentGradStatus
);

router.post(
  "/:studentID/gradProgram/status",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  postStudentGradStatus
);

router.get(
  `/:studentID/gradProgram/undoCompletion`,
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentUndoCompletion
);

router.post(
  `/:studentID/gradProgram/undoCompletion`,
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  postStudentUndoCompletion
);

router.get(
  "/:studentID/runGradAlgorithm",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRunGradAlgorithm
);

router.get(
  "/:studentID/previewFinalMarks",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRunPreviewFinalMarks
);

router.get(
  "/:studentID/updateTranscriptVerification",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRunTranscriptVerification
);

router.get(
  "/:studentID/updateTranscript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getRunUpdateTranscript
);

// STUDENT REPORTS
router.get(
  "/studentReports/:studentID/transcript",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentTranscript
);

router.get(
  "/studentReports/:studentID/transcriptVerificationReport",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentTVR
);

router.get(
  "/studentReports/:studentID/certificate",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCertificate
);

router.get(
  "/studentReports/:studentPEN/XML",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentXMLReport
);

// STUDENT NOTES
router.get(
  "/:studentID/notes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentNotes
);

router.post(
  "/:studentID/notes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  postStudentNotes
);

router.delete(
  "/:studentID/notes/:noteID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  deleteStudentNotes
);

// STUDENT SEARCH
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentAdvancedSearch
);

router.get(
  "/pen/:studentPEN",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentByPen
);

router.get(
  "/id/:studentID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentByID
);

// STUDENT ADOPT
router.post(
  "/adopt/:studentID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(postAdoptStudentSchema),
  postAdoptPENStudent
);

module.exports = router;
