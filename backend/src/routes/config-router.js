"use strict";

const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/index");
const HttpStatus = require("http-status-codes");
const axios = require("axios")


  router.get(
    "/*",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const fileUrl = "https://raw.githubusercontent.com/bcgov/EDUC-GRAD-ADMIN/main/grad-version";
  
      let version = null;
  
      try {
        const response = await axios.get(fileUrl, { responseType: 'json' });
        const environmentVersions = response.data.version;
        
        const environment = config.get('environment');
        if (environment === 'dev' || environment === 'local') {
          version = environmentVersions.dev;
        } else if (environment === 'test') {
          version = environmentVersions.test;
        } else if (environment === 'prod') {
          version = environmentVersions.prod;
        }
      } catch (error) {
        console.error('Error retrieving version file:', error);
      }
  
      const frontendConfig = config.get('frontendConfig');
  
      const configMap = {
        STUDENT_ADMIN_URL: frontendConfig.studentAdminURL,
        ENVIRONMENT: config.get('environment'),
        VERSION: version
    
      };
  
      return res.status(HttpStatus.OK).json(configMap);
    }
  );
  
  module.exports = router;