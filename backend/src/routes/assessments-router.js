const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require('../components/roles');
const {
  errorResponse,
  getData
} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  'GRAD_SYSTEM_COORDINATOR',
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
  ]
);

//Assessment Routes
router.get(
  '/*',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getAssessmentAPI
);

async function getAssessmentAPI(req, res) {
  const token = auth.getBackendToken(req);
  const version = req.version;
  try {
    let url = `${config.get(
      'server:assessmentAPIURL'
    )}/api/${version}/assessment`;

    if (req.url != '/') {
      url += req.url;
    }
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
