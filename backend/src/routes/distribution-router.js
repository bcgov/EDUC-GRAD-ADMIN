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

//Batch Routes
router.get(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getDistributionAPI
);

async function getDistributionAPI(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url =
      `${config.get("server:distributionAPIURL")}/distribute` + req.url;
    const data = await getData(token, url, req.session?.correlationID);
    res.send(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = router;
