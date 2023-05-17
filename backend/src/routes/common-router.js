const passport = require('passport');
const express = require('express');
const router = express.Router();
const config = require('../config/index');
const axios = require('axios');


router.get('/*', (req, res) => {
  // Handle GET request to /api/data
  const fileUrl = "https://raw.githubusercontent.com/bcgov/EDUC-GRAD-ADMIN/main/version"
  axios.get(fileUrl, { responseType: 'arraybuffer' })
  .then((response) => {
    const fileData = response.data;
    const contentType = response.headers['content-type'];
    const contentDisposition = `attachment; filename="external-file.pdf"`;

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', contentDisposition);
    res.send(fileData);
  })
  .catch((error) => {
    console.error('Error retrieving file:', error);
    res.status(500).send('Internal Server Error');
  });


});



module.exports = router;
