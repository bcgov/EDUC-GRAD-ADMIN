const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData, postData, deleteData} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffAdministration]);

//Batch Routes
router.get('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getBatchInfoAPI);
router.post('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, postBatchInfoAPI);
router.delete('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, deleteBatchInfoAPI);

async function getBatchInfoAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await getData(token, url);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}
async function postBatchInfoAPI(req, res) {
  const token = getBackendToken(req);
  try {  
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await postData(token, url, req.body );
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}
async function deleteBatchInfoAPI(req, res) {
  const token = getBackendToken(req);

  try {  
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await deleteData(token, url);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}

module.exports = router;
