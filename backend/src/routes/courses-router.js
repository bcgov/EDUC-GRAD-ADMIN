const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('../components/auth');
const roles = require('../components/roles');
const {
  getCourseByCodeAndLevel,
  getCourseByID,
  getAllCourseRestrictions,
  getCourseRestrictionByCodeAndLevel,
  postCourseRestriction,
  putCourseRestriction,
  getExaminableCourseSessions,
  getCourseRequirementsByRule,
  getCourseRequirements,
  getStudentCoursesLegacy,
  getStudentExamDetailsLegacy, getCourseEventHistory, putCourseEventHistory,
  downloadCourseRestrictionsCSV,
  getCoursePaginated,
  getAllCoreg39Courses,
} = require('../components/course');
const validate = require('../components/validator');
const {
  createCourseRestrictionSchema,
  updateCourseRestrictionSchema,
} = require('../components/validations/course');

const isValidUiTokenWithReadStaffRoles = auth.isValidUiTokenWithRoles(
  'GRAD_SYSTEM_COORDINATOR && SCHOLARSHIP_ADMIN',
  [
    roles.Admin.StaffInfoOfficer,
    roles.Admin.StaffAdministration,
    roles.Admin.StaffGradProgramBA,
    roles.Admin.StaffGradAssessments,
    roles.Admin.ScholarshipAdmin
  ]
);

const isValidUiTokenWithEditStaffRoles = auth.isValidUiTokenWithRoles(
  'GRAD_SYSTEM_COORDINATOR',
  [roles.Admin.StaffInfoOfficer, roles.Admin.StaffAdministration]
);

router.get(
  '/search',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseByCodeAndLevel
);

router.get(
  '/courseID/:courseID',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseByID
);

router.get(
  '/courseRestrictions/download',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  downloadCourseRestrictionsCSV
);

router.get(
  '/courseRestrictions',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAllCourseRestrictions
);

router.get(
  '/courseRestriction',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseRestrictionByCodeAndLevel
);

router.post(
  '/courseRestriction',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(createCourseRestrictionSchema),
  postCourseRestriction
);

router.put(
  '/courseRestriction/:restrictionID',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithEditStaffRoles,
  validate(updateCourseRestrictionSchema),
  putCourseRestriction
);

router.get(
  '/examinableCourseSessions',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getExaminableCourseSessions
);

router.get(
  '/requirementRule',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseRequirementsByRule
);

router.get(
  '/courseRequirements',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCourseRequirements
);

router.get(
  '/legacy/studentCourses/:studentPEN',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentCoursesLegacy
);

router.get(
  '/legacy/studentExamDetails/:studentPEN',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getStudentExamDetailsLegacy
);

router.get(
  '/eventHistory',
  passport.authenticate('jwt', { session: false }),
  isValidUiTokenWithReadStaffRoles,
  getCourseEventHistory
);

router.put(
  '/eventHistory',
  passport.authenticate('jwt', { session: false }), 
  isValidUiTokenWithEditStaffRoles,
  putCourseEventHistory
);

router.get(
  '/coreg/all',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getAllCoreg39Courses
);

router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidUiTokenWithReadStaffRoles,
  getCoursePaginated
);

module.exports = router;
