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
const isValidUiTokenWithUpdateStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [roles.Admin.StaffAdministration]
);

router.get(
  "/allSchools",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getInstituteSchoolsList
);

router.get(
  "/school/:schoolID",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getInstituteSchool
);

router.get(
  "/allDistricts",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getInstituteDistrictsList
);

router.get(
  "/district/:districtID",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getInstituteDistrict
);

router.get(
  "/postSecondary/search",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getPSISearch
);

router.get(
  "/eventHistory",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getInstituteEventHistory
);

router.put(
  "/eventHistory",
  passport.authenticate("jwt", { session: false }),
  isValidUiTokenWithUpdateStaffRoles,
  putInstituteEventHistory
);

module.exports = router;
