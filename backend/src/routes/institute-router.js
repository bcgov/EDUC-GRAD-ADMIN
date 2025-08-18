const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  errorResponse,
  getCommonServiceData,
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
    roles.Admin.StaffGradAssessments,
  ]
);

//Program Routes
router.get("/*",
    passport.authenticate("jwt", { session: false }, undefined),
    isValidUiTokenWithStaffRoles,
    getInstituteAPI);

async function getInstituteAPI(req, res) {
  const version = req.version;
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/${version}/institute${req.url}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = router;
