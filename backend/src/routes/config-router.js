"use strict";

const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const HttpStatus = require("http-status-codes");

router.get(
  "/*",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const frontendConfig = config.get('frontendConfig');
    const configMap = {
      STUDENT_ADMIN_URL: frontendConfig.studentAdminURL      
    };
    return res.status(HttpStatus.OK).json(configMap);
  });
  
  module.exports = router;