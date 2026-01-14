const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const passport = require("passport");
const validate = require("../components/validator");
const {
  getStudentCoursePaginated,
  getCourseStudentSearchReport
} = require("../components/courses/student-course");

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffAdministration,
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffGradAssessments,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  "/student/paginated",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentCoursePaginated
);

router.get(
  "/report/course-students/search/download",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseStudentSearchReport
);

module.exports = router;

