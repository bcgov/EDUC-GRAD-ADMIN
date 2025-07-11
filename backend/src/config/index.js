"use strict";
const nconf = require("nconf");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const env = process.env.NODE_ENV || "local";

nconf
  .argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

//injects environment variables into the json file
nconf.overrides({
  environment: env,

  server: {
    logLevel: process.env.LOG_LEVEL,
    morganFormat: "dev",
    port: 8080,
  },
});

nconf.defaults({
  environment: env,
  logoutEndpoint:
    process.env.SOAM_URL + "/auth/realms/master/protocol/openid-connect/logout",
  siteMinder_logout_endpoint: process.env.SITEMINDER_LOGOUT_ENDPOINT,
  server: {
    frontend: process.env.SERVER_FRONTEND,
    backend: process.env.SERVER_FRONTEND + "/api",
    logLevel: process.env.LOG_LEVEL,
    morganFormat: "dev",
    port: 8080,
    session: {
      maxAge: +process.env.SESSION_MAX_AGE,
    },
    administration: {
      roleAdmin: process.env.GRAD_ROLE_ADMIN,
      roleInfoOfficer: process.env.GRAD_ROLE_INFO_OFFICER,
      roleGradProgramAreaBA: process.env.GRAD_PROGRAM_AREA_BA,
    },
    idirIDPHint: process.env.IDIR_IDP_HINT,
    assessmentAPIURL: process.env.ASSESSMENT_API_URL,
    batchAPIURL: process.env.BATCH_API_URL,
    courseAPIURL: process.env.COURSE_API_URL,
    graduationAPIURL: process.env.GRADUATION_API_URL,
    graduationReportAPIURL: process.env.GRADUATION_REPORT_API_URL,
    programAPIURL: process.env.PROGRAM_API_URL,
    studentAPIURL: process.env.GRAD_STUDENT_API_URL,
    studentGraduationAPIURL: process.env.STUDENT_GRADUATION_API_URL,
    gradTraxAPIURL: process.env.GRAD_TRAX_API_URL,
    reportAPIURL: process.env.GRAD_REPORT_API_URL,
    distributionAPIURL: process.env.DISTRIBUTION_API_URL,
    instituteAPIURL: process.env.INSTITUTE_API_URL,
    studentAssessmentAPIURL: process.env.STUDENT_ASSESSMENT_API_URL,
  },
  oidc: {
    publicKey: process.env.SOAM_PUBLIC_KEY,
    clientId: process.env.SOAM_CLIENT_ID,
    clientSecret: process.env.SOAM_CLIENT_SECRET,
    serviceClientId: process.env.SOAM_SERVICE_CLIENT_ID,
    serviceClientSecret: process.env.SOAM_SERVICE_CLIENT_SECRET,
    discovery: process.env.SOAM_DISCOVERY,
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY,
    audience: process.env.SERVER_FRONTEND,
    issuer: process.env.ISSUER,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  frontendConfig: {
    studentAdminURL: process.env.STUDENT_ADMIN_URL
  },
});
module.exports = nconf;
