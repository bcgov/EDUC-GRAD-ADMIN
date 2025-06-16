const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const { errorResponse, getData, postData, putData } = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

//Course Routes
router.get(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseAPI
);

router.post(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  postCourseRestrictionAPI
);

router.put(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  putCourseRestrictionAPI
);

async function getCourseAPI(req, res) {
  const token = auth.getBackendToken(req);
  const version = req.version;
  try {
    const url = `${config.get("server:courseAPIURL")}/api/${version}/course${
      req.url
    }`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function postCourseRestrictionAPI(req, res) {
  const token = auth.getBackendToken(req);
  const version = req.version;
  try {
    const url = `${config.get("server:courseAPIURL")}/api/${version}/course${
      req.url
    }`;
    const data = await postData(
          token,
          url,
          req.body,
          req.session?.correlationID
        );
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function putCourseRestrictionAPI(req, res) {
  const token = auth.getBackendToken(req);
  const version = req.version;
  try {
    const url = `${config.get("server:courseAPIURL")}/api/${version}/course${
      req.url
    }`;    
    const data = await putData(
          token,          
          req.body,
          url,
          req.session?.correlationID
        );
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
