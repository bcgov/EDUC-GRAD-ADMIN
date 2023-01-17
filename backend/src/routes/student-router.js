const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require('../components/roles');
const { errorResponse, getBackendToken, getData, postData, putData, deleteData} = require('../components/utils');

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffAdministration]);

//Program Routes
router.get('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getStudentAPI);
router.post('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, postStudentAPI);
router.delete('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, deleteStudentAPI);

async function getStudentAPI(req, res) {
  const token = getBackendToken(req);
  
  try {
    const url = `${config.get('server:studentAPIURL')}/student` + req.url;
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
async function postStudentAPI(req, res) {
  const token = getBackendToken(req);
  try {  
    const url = `${config.get('server:studentAPIURL')}/student` + req.url;
    const data = await postData(token, url, req.body );
    return res.status(200).json(data);
  } catch (e) {
    if(e.data.messages){
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
    
  }
}
async function deleteStudentAPI(req, res) {
  const token = getBackendToken(req);
  try {  
    const url = `${config.get('server:studentAPIURL')}/student` + req.url;
    const data = await deleteData(token, url);
    return res.status(200).json(data);
  } catch (e) {
      return errorResponse(res);
  }
}

module.exports = router;
