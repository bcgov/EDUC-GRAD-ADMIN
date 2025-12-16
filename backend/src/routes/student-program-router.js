const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const roles = require('../components/roles');
const passport = require('passport');
const {
  getStudentProgramPaginated,
  getProgramStudentSearchReport
} = require('../components/programs/student-program');

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  'GRAD_SYSTEM_COORDINATOR',
  [
    roles.Admin.StaffAdministration,
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffGradAssessments,
    roles.Admin.StaffGradProgramBA,
  ]
);

router.get(
  '/student/paginated',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentProgramPaginated
);

router.get(
  '/report/program-students/search/download',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getProgramStudentSearchReport
);

module.exports = router;

