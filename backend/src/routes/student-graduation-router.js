const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData, postData, putData, deleteData} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffAdministration]);

//Program Routes
router.get('*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getStudentGraduationAPI);
router.post('*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, postStudentGraduationAPI);

async function getStudentGraduationAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:studentGraduationAPIURL')}/studentgraduation` + req.url;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if(e.data.message){
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}
async function postStudentGraduationAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:studentGraduationAPIURL')}/studentgraduation` + req.url;
    const data = await postData(token, url, null, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if(e.data.message){
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = router;
