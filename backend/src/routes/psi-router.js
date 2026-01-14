const passport = require("passport");
const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const validate = require("../components/validator");
const { getPaginatedPSISchema } = require("../components/validations/psi");
const { getPSIPaginated } = require("../components/psi");

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR && SCHOLARSHIP_ADMIN",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
    roles.Admin.ScholarshipAdmin
  ]
);

router.get(
  "/paginated",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  validate(getPaginatedPSISchema),
  getPSIPaginated
);

module.exports = router;
