const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData, postData, deleteData, putData} = require('../components/utils');
const { request } = require('../app');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffInfoOfficer, roles.Admin.StaffAdministration, roles.Admin.StaffGradProgramBA]);

//Batch Routes
router.get('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getBatchInfoAPI);
router.post('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, postBatchInfoAPI);
router.delete('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, deleteBatchInfoAPI);
router.put('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, putBatchInfoAPI)

async function getBatchInfoAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
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
async function postBatchInfoAPI(req, res) {
  const token = getBackendToken(req);
  try {  
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await postData(token, url, req.body, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if(e.data.message){
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}
async function deleteBatchInfoAPI(req, res) {
  const token = getBackendToken(req);

  try {  
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await deleteData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res);
  }
}
async function putBatchInfoAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url = `${config.get('server:batchAPIURL')}/batch` + req.url;
    const data = await putData(token, {}, url, req.session?.correlationID);
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
