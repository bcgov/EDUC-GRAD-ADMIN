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
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  "/gradProgram/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGradProgramRules
);

router.get(
  "/gradProgram/rules/:programCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGradProgramRulesByCode
);

router.get(
  "/gradProgram/:programCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGradProgramByCode
);

router.get(
  "/optionalProgram/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getOptionalProgramRules
);

router.get(
  "/algorithm/rules",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAlgorithmRules
);

module.exports = router;
