const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getCourseByCodeAndLevel,
  getCourseByID,
  getAllCourseRestrictions,
  getCourseRestrictionByCodeAndLevel,
  postCourseRestriction,
  putCourseRestriction,
  getExaminableCourseSessions,
  getCourseRequirementsByRule,
  getCourseRequirements,
  getStudentCoursesLegacy,
  getStudentExamDetailsLegacy,
} = require("../components/course");

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseByCodeAndLevel
);

router.get(
  "/courseID/:courseID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseByID
);

router.get(
  "/courseRestrictions",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAllCourseRestrictions
);

router.get(
  "/courseRestriction",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseRestrictionByCodeAndLevel
);

router.post(
  "/courseRestriction",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postCourseRestriction
);

router.put(
  "/courseRestriction/:restrictionID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  putCourseRestriction
);

router.get(
  "/examinableCourseSessions",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getExaminableCourseSessions
);

router.get(
  "/requirementRule",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseRequirementsByRule
);

router.get(
  "/courseRequirements",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseRequirements
);

router.get(
  "/legacy/studentCourses/:studentPEN",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentCoursesLegacy
);

router.get(
  "/legacy/studentExamDetails/:studentPEN",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentExamDetailsLegacy
);

module.exports = router;
