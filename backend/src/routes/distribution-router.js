const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const auth = require("../components/auth");
const roles = require("../components/roles");
const {
  errorResponse,
  getBackendToken,
  getData,
  postData,
  deleteData,
} = require("../components/utils");
const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  "GRAD_SYSTEM_COORDINATOR",
  [roles.Admin.StaffAdministration]
);

//Batch Routes
router.get(
  "/*",
  passport.authenticate("jwt", { session: false }, undefined),
  isValidUiTokenWithStaffRoles,
  getDistributionAPI
);

async function getDistributionAPI(req, res) {
  const token = getBackendToken(req);
  try {
    const url =
      `${config.get("server:distributionAPIURL")}/distribute` + req.url;
    const data = await getData(token, url, req.session?.correlationID);
    // console.log(data);
    // res.set('Content-Type','application/zip');
    // res.set('Content-Disposition','attachment; filename="download.zip"');
    // res.set('Content-Length', data.length);
    // //res.pipe(data, 'binary')
    // //return res.end();
    // return res.send(data).status(200)

    // let zip = Buffer.from(data, 'base64');

    //  res.writeHead(200, {
    //    'Content-Type': 'application/zip',
    //    'Content-Disposition': 'attachment; filename=test.zip',
    //    'Content-Length': zip.length
    // });
    // res.end(zip); 

// console.log(data)
  var zip = Buffer.from(data, 'base64');

   res.writeHead(200, {
     'Content-Type': 'application/zip',
     'Content-Disposition': 'attachment; filename=test.zip',
     'Content-Length': zip.length
   });
   res.end(zip); 


  } catch (e) {
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = router;
