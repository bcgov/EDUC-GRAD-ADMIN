const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffInfoOfficer, roles.Admin.StaffAdministration, roles.Admin.StaffGradProgramBA]);

router.get('/*',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getStudentExamAPI);

async function getStudentExamAPI(req, res) {
    const token = getBackendToken(req);
    const version = req.version;
    try {
      const url = `${config.get('server:courseAPIURL')}/api/${version}/studentexam${req.url}`;
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
module.exports = router;