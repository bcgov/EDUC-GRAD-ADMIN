const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const { getAllSchoolsList,  getSchoolBySchoolID, getAllSchoolDetails, getFullSchoolDetails, getAllCachedSchools } = require('../components/school');
const { getAllDistrictList, getDistrictByDistrictID } = require('../components/district');
const {
  errorResponse,
  getBackendToken,
  getData,
  postData,
  putData,
  deleteData,
} = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
  ]
);

//Program Routes
router.get('/school', passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getAllCachedSchools);
router.get('/school/list', passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getAllSchoolsList);
router.get('/school/:schoolID',passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getFullSchoolDetails);
router.get('/district/list', passport.authenticate('jwt', {session: false}, undefined), isValidUiTokenWithStaffRoles, getAllDistrictList);

router.get("/*", getInstituteAPI);

async function getInstituteAPI(req, res) {
  const token = getBackendToken(req);
  const version = req.version;
  try {
    const url = `${config.get('server:instituteAPIURL')}/api/${version}/institute${req.url}` ;
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
