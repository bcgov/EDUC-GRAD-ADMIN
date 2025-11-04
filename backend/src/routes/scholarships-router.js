const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const passport = require("passport");
const validate = require("../components/validator");
const {getStudentAddress, updateStudentAddress, getCitizenshipCodes, getCountryCodes, getProvinceCodes} = require("../components/scholarships");
const {
  getStudentAddressSchema,
  putStudentAddressSchema,
} = require("../components/validations/scholarships");
const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.ScholarshipAdmin
  ]
);

router.get(
  "/citizenship-codes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCitizenshipCodes
);

router.get(
  "/country-codes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCountryCodes
);

router.get(
  "/province-codes",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getProvinceCodes
);

router.get(
  "/student/:studentID/address/",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
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


module.exports = router;