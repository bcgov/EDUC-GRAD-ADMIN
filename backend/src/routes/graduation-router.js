const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  errorResponse,
  getData,
  postData,
  putData,
  deleteData,
} = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

//Program Routes
router.get(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGraduationAPI
);

async function getGraduationAPI(req, res, next) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:graduationAPIURL")}/graduate` + req.url;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

module.exports = router;
