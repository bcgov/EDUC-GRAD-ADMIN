const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');

const path = __dirname + '/app/view/';
//const history = require('connect-history-api-fallback');
const app = express();

app.use(express.static(path));
// app.use(history({
//   disableDotRule: true,
//   verbose: true
// }));
var corsOptions = {
  origin: "https://localhost:8080"
};

const COURSE_API_HOST="https://grad-course-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const COURSE_ACHIEVEMENT_API_HOST="https://student-course-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const GRADUATION_STATUS_API_HOST="https://educ-grad-graduation-status-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const STUDENTS_API_HOST="https://gradstudent-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const STUDENT_EXAMS_API_HOST="https://student-exam-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const STUDENT_ASSESSMENTS_API_HOST="https://student-assessment-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const GRADUATION_COMMON_API_HOST =" https://educ-grad-common-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const SCHOOL_API_HOST =" https://educ-grad-school-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const GRADUATION_API_HOST="https://educ-grad-graduation-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const PROGRAM_MANAGEMENT_API_HOST="https://educ-grad-program-management-api-77c02f-dev.apps.silver.devops.gov.bc.ca";
const PSI_API_HOST="https://educ-grad-psi-api-77c02f-dev.apps.silver.devops.gov.bc.ca";

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const db = require("./app/models");

// db.sequelize.sync();
app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies.');
});

app.get('/index.html', function (req,res) {
  res.sendFile(path + "index.html");
});
app.use('/api/students', createProxyMiddleware({
  target: STUDENTS_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/students`]: '',
  },
}));

app.use('/api/course-achievement', createProxyMiddleware({
  target: COURSE_ACHIEVEMENT_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/course-achievement`]: '',
  },
}));

app.use('/api/student-assessments', createProxyMiddleware({
  target: STUDENT_ASSESSMENTS_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/student-assessments`]: '',
  },
}));

app.use('/api/program-management', createProxyMiddleware({
  target: PROGRAM_MANAGEMENT_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/program-management`]: '',
  },
}));

// app.use('/api/program-rules', createProxyMiddleware({
//   target: PROGRAM_RULES_API_HOST,
//   changeOrigin: true,
//   pathRewrite: {
//       [`^/api/program-rules`]: '',
//   },
// }));

app.use('/api/graduation-status', createProxyMiddleware({
  target: GRADUATION_STATUS_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/graduation-status`]: '',
  },
}));

app.use('/api/student-exams', createProxyMiddleware({
  target: STUDENT_EXAMS_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/student-exams`]: '',
  },
}));

app.use('/api/graduation-common', createProxyMiddleware({
  target: GRADUATION_COMMON_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/graduation-common`]: '',
  },
}));

app.use('/api/school', createProxyMiddleware({
  target: SCHOOL_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/school`]: '',
  },
}));

app.use('/api-graduation', createProxyMiddleware({
  target: GRADUATION_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api-graduation`]: '',
  },
}));
app.use('/api/psi', createProxyMiddleware({
  target: PSI_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/psi`]: '',
  },
}));
app.use('/api/course', createProxyMiddleware({
  target: COURSE_API_HOST,
  changeOrigin: true,
  pathRewrite: {
      [`^/api/course`]: '',
  },
}));
//require("./app/routes/turorial.routes")(app);

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, ipaddress, function() {
  console.log("Server is running on " + ipaddress + " port " + port);
});