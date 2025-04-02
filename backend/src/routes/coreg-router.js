const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const { errorResponse, getCommonServiceData } = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

// CoReg Routes

router.get(
  "/course/information/:courseId",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseInformationById
);

router.get(
  "/course/information/external/:externalCode",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getCourseInformationByExternalCode
);

router.get(
  "/grad-program-course/information/paginated*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getGradProgramCourses
);

async function getCourseInformationById(req, res) {
  try {
    const url = `${config.get("server:coregAPIURL")}/api/${
      req.version
    }/course/information/${req.params?.courseId}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return response(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getCourseInformationByExternalCode(req, res) {
  try {
    const url = `${config.get("server:coregAPIURL")}/api/${
      req.version
    }/course/information/external/${req.params?.externalCode}`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return response(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getGradProgramCourses(req, res) {
  try {
    const url = `${config.get("server:coregAPIURL")}/api/${
      req.version
    }/grad-program-course/information/paginated`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.message) {
      return response(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = router;
