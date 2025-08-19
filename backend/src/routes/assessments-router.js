const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const { errorResponse, getData } = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

// DEPRECATING - Keeping all functions in this file since it will be removed soon
//Assessment Routes
router.get(
  "/assessments",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAllAssessments
);

router.get(
  "/requirements",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAllAssessmentRequirements
);

router.get(
  "/requirements/rule/:rule",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAssessmentRequirementRule
);

router.get(
  "/studentAssessment/:pen",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentAssessment
);

async function getAllAssessments(req, res) {
  const token = auth.getBackendToken(req);
  try {
    let url = `${config.get("server:assessmentAPIURL")}/api/v1/assessment`;
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

async function getAllAssessmentRequirements(req, res) {
  const token = auth.getBackendToken(req);
  try {
    let url = `${config.get(
      "server:assessmentAPIURL"
    )}/api/v1/assessment/requirement`;
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

async function getAssessmentRequirementRule(req, res) {
  const token = auth.getBackendToken(req);
  try {
    let url = `${config.get(
      "server:assessmentAPIURL"
    )}/api/v1/assessment/requirement/rule?rule=${req.params?.rule}`;
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

async function getStudentAssessment(req, res) {
  const token = auth.getBackendToken(req);
  try {
    let url = `${config.get("server:assessmentAPIURL")}/api/v1/assessment/pen/${
      req.params?.pen
    }?sortForUI=true`;
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

module.exports = router;
