const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const passport = require("passport");
const validate = require("../components/validator");
const {getStudentAddress, updateStudentAddress} = require("../components/scholarships");
const {
  getStudentAddressSchema,
  putStudentAddressSchema,
} = require("../components/validations/scholarships");

const {
  postStudentGradStatus
}
= require("../components/student/student");
const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  'SCHOLARSHIP_ADMIN',
  [
    roles.Admin.ScholarshipAdmin
  ]
);

router.get(
  "/student/:studentID/address/",
  passport.authenticate("jwt", { session: false }, undefined),
  validate(getStudentAddressSchema),
  getStudentAddress
);

router.put(
  "/student/:studentID/address/:studentAddressID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  validate(putStudentAddressSchema),
  updateStudentAddress
);

router.post(
  "/student/:studentID/citizenship/status",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  postStudentGradStatus
);


module.exports = router;
