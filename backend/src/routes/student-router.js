const passport = require("passport");
const express = require("express");
const router = express.Router();

const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getStudentCourseByStudentID,
  putStudentCoursesByStudentID,
  postStudentCoursesByStudentID,
  deleteStudentCoursesByStudentID,
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
  getStudentNotes,
  postStudentNotes,
  deleteStudentNotes,
  getStudentAdvancedSearch,
  getStudentByPen,
  getStudentByID,
  postAdoptPENStudent,
} = require("../components/student");

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

// STUDENT COURSES
router.get(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCourseByStudentID
);

router.put(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  putStudentCoursesByStudentID
);

router.post(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postStudentCoursesByStudentID
);

router.delete(
  "/:studentID/courses",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
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
  isValidUiTokenWithStaffRoles,
  postStudentOptionalProgram
);

router.delete(
  "/:studentID/optionalPrograms/:optionalProgramID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
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
  isValidUiTokenWithStaffRoles,
  postStudentCareerProgram
);

router.delete(
  "/:studentID/careerPrograms/:careerProgramCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
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
  isValidUiTokenWithStaffRoles,
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
  isValidUiTokenWithStaffRoles,
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
  isValidUiTokenWithStaffRoles,
  postStudentNotes
);

router.delete(
  "/:studentID/notes/:noteID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
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
  "/adopt",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postAdoptPENStudent
);

module.exports = router;
