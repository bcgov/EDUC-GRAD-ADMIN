const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const roles = require('../components/roles');
const passport = require('passport');
const validate = require('../components/validator');
const {
  putStudentAssessmentSchema,
  postStudentAssessmentSchema,
  deleteStudentAssessmentSchema,
  getPaginatedStudentAssessmentSchema
} = require('../components/validations/student-assessment');
const {
  getStudentAssessmentById, getStudentAssessmentPaginated,
  updateStudentAssessmentById, postStudentAssessment,
  deleteStudentAssessmentByID, getAssessmentTypeCodes,
  getAllAssessmentSessions, getProvincialSpecialCaseCodes, getStudentAssessmentHistoryPaginated
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

router.get('/provincial-special-case-codes',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getProvincialSpecialCaseCodes
);

router.get('/student/paginated',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(getPaginatedStudentAssessmentSchema),
  getStudentAssessmentPaginated
);

router.get('/student-history/paginated',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(getPaginatedStudentAssessmentSchema),
  getStudentAssessmentHistoryPaginated
);

router.get('/student/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getStudentAssessmentById
);

router.put('/student/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(putStudentAssessmentSchema),
  updateStudentAssessmentById
);

router.post('/student',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(postStudentAssessmentSchema),
  postStudentAssessment
);

router.delete('/student/:studentAssessmentId',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  validate(deleteStudentAssessmentSchema),
  deleteStudentAssessmentByID
);

router.get('/sessions',
  passport.authenticate('jwt', {session: false}, undefined),
  isValidUiTokenWithStaffRoles,
  getAllAssessmentSessions
);

module.exports = router;
