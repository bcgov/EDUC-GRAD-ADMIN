const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const roles = require('../components/roles');
const passport = require('passport');
const validate = require('../validations/validator');
const {putStudentAssessmentSchema, postStudentAssessmentSchema} = require('../validations/student-assessment');
const {
  getStudentAssessmentById, getStudentAssessmentPaginated,
  updateStudentAssessmentById, postStudentAssessment,
  deleteStudentAssessmentByID, getAssessmentTypeCodes
} = require('../components/assessments/student-assessment');

const isValidUiTokenWithStaffRoles = auth.isValidUiTokenWithRoles(
  'GRAD_SYSTEM_COORDINATOR',
  [
    roles.Admin.StaffAdministration,
  ]
);

router.get('/assessment-type-codes',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getAssessmentTypeCodes
);

router.get('/paginated',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentAssessmentPaginated
);

router.get('/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentAssessmentById
);

router.put('/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(putStudentAssessmentSchema),
  updateStudentAssessmentById
);

router.post('/student-assessment',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(postStudentAssessmentSchema),
  postStudentAssessment
);

router.delete('/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  deleteStudentAssessmentByID
);

module.exports = router;
