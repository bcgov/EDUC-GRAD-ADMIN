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
const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
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
  isValidUiTokenWithReadStaffRoles,
  getSchoolReport
);

router.get(
  "/schoolReports/district/:districtID",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getDistrictReport
);

router.get(
  "/signatures",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getDigitalSignatures
);

module.exports = router;
