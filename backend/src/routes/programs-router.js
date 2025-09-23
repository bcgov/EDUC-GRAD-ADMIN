const passport = require("passport");
const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getGradProgramRules,
  getGradProgramRulesByCode,
  getGradProgramByCode,
  getOptionalProgramRules,
  getAlgorithmRules,
} = require("../components/programs");
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
  "/gradProgram/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getGradProgramRules
);

router.get(
  "/gradProgram/rules/:programCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getGradProgramRulesByCode
);

router.get(
  "/gradProgram/:programCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getGradProgramByCode
);

router.get(
  "/optionalProgram/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getOptionalProgramRules
);

router.get(
  "/algorithm/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAlgorithmRules
);

module.exports = router;
