const passport = require("passport");
const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getSchoolReport,
  getDistrictReport,
  getDigitalSignatures,
} = require("../components/reports");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

router.get(
  "/schoolReports/school/:schoolID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getSchoolReport
);

router.get(
  "/schoolReports/district/:districtID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getDistrictReport
);

router.get(
  "/signatures",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getDigitalSignatures
);

module.exports = router;
