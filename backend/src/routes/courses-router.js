const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffAdministration]);

//Course Routes
router.get('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getCourseAPI);

async function getCourseAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:courseAPIURL')}/course` + req.url;
    const data = await getData(token, url);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}

module.exports = router;