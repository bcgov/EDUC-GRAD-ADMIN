'use strict';

const config = require('../config/index');

const roles = {
  User: {
    //Help functions created in auth module: isValidStudentSearchUserToken, isValidStudentSearchUser
    StudentSearch: config.get('server:studentSearch:roleAdmin'),
    //Help functions created in auth module: isValidStaffAdministrationUser
    StaffAdministration: config.get('server:administration:roleAdmin'),
  },
  Admin: {
    //Help functions created in auth module: isValidStudentSearchAdmin
    StudentSearch: config.get('server:studentSearch:roleAdmin'),
    //Help functions created in auth module: isValidStaffAdministrationAdmin
    StaffAdministration: config.get('server:administration:roleAdmin') || 'GRAD_SYSTEM_COORDINATOR' || 'GRAD_INFO_OFFICER' || 'GRAD_PROGRAM_AREA_BA'
  }
};

module.exports = roles;
