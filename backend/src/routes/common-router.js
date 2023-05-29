const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const axios = require('axios');


router.get('/*', (req, res) => {
  // Handle GET request to /api/data
  
  const fileUrl = "https://raw.githubusercontent.com/bcgov/EDUC-GRAD-ADMIN/main/version2";
  axios.get(fileUrl, { responseType: 'json' })
    .then((response) => {

      const environtmentVersions = response.data.version;
  
      console.log()
      let environment = req.get('host');
      if (environment === 'dev.grad.gov.bc.ca') {
        version = environtmentVersions.dev
      } else if (environment === 'test.grad.gov.bc.ca') {
        version = environtmentVersions.test
      } else if (environment === 'grad.gov.bc.ca') {
        version = environtmentVersions.prod
      } else if (environment === 'localhost:8080') {
        version = environtmentVersions.dev
      }
      res.send(version);
    })
    .catch((error) => {
      console.error('Error retrieving file:', error);
      res.status(500).send('Internal Server Error');
    });


});



module.exports = router;
