const passport = require("passport");
const express = require("express");
const router = express.Router();
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  getInstituteSchoolsList,
  getInstituteDistrictsList,
  getInstituteSchool,
  getInstituteDistrict,
  getPSISearch,
  getInstituteEventHistory,
  putInstituteEventHistory,
} = require("../components/schools");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  "/allSchools",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getInstituteSchoolsList
);

router.get(
  "/school/:schoolID",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getInstituteSchool
);

router.get(
  "/allDistricts",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getInstituteDistrictsList
);

router.get(
  "/district/:districtID",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getInstituteDistrict
);

router.get(
  "/postSecondary/search",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getPSISearch
);

router.get(
  "/eventHistory",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  getInstituteEventHistory
);

router.put(
  "/eventHistory",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithStaffRoles,
  putInstituteEventHistory
);

module.exports = router;
