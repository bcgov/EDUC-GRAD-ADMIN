const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const auth = require('../components/auth');
const roles = require("../components/roles");
const { errorResponse, getBackendToken, getData, postData, putData, deleteData} = require('../components/utils');
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles('GRAD_SYSTEM_COORDINATOR', [roles.Admin.StaffInfoOfficer, roles.Admin.StaffAdministration,roles.Admin.StaffGradProgramBA]);

router.get('*', 
  passport.authenticate('jwt', { session: false }), 
  isValidUiTokenWithStaffRoles, 
  getTRAXAPI
);

async function getTRAXAPI(req, res) {
  const token = getBackendToken(req);
  const urlParts = req.baseUrl.split('/').filter(Boolean); // Split and remove empty parts
  let version = urlParts[0]; // Get the first part which is the version
  // Set the version on the request object
  if (version === 'api') {
    version = urlParts[1]; // Skip the 'api' part in OpenShift
  }
  try {
    const configKey = `server:gradTraxAPIURL${version}`;

    // Fetch the base URL from the config using the dynamic key
    const baseURL = config.get(configKey);
    
    url = baseURL + "/trax" + req.url;
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
