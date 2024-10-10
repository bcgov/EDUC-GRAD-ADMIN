let baseRoot = "/api";
const authRoot = baseRoot + "/auth";

let object = {
  LOGIN: authRoot + "/login",
  LOGOUT: authRoot + "/logout",
  SESSION_EXPIRED: authRoot + "/logout?sessionExpired=true",
  REFRESH: authRoot + "/refresh",
  TOKEN: authRoot + "/token",
  USER: authRoot + "/user",
  SESSION_REMAINING_TIME: authRoot + "/user-session-remaining-time",
};

//endpoints
export const Routes = Object.freeze(object);

//roles
// export const RolePermissions = Object.freeze({
//   ADMINISTRATOR: "GRAD_SYSTEM_COORDINATOR",
//   BATCH_READER: "Batch Reader",
// });
export const RolePermissions = Object.freeze({
  STUDENT: {
    updateGradStatus: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    createStudentNotes: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    updateRecalcFlags: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    optionalProgramUpdate: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
  },
  BATCH: {
    createBatchJob: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    runArchiveStudents: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runArchiveSchoolReports: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runTVRDelete: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    selectTVRDeleteSchools: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    selectAllOption: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
   
    runGradAlgorithm: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    runTVR: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
  
    selectSchoolCategoryGroup: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    selectProgramGroup: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runDistrunYE: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runDistrun: {
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    runNonGradRun: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runDistrunSupplemental: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runPSIBatch: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
    runCertificateRegeneration:{
      allowed: ['GRAD_SYSTEM_COORDINATOR', 'GRAD_INFO_OFFICER'],
    },
    runSchoolReportRegeneration:{
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },    
    toggleBatchRoutines: {
      allowed: ['GRAD_SYSTEM_COORDINATOR'],
    },
  },
});




//role access
export const Roles = Object.freeze({
  GRAD_PROGRAM_AREA_BA: "GRAD_PROGRAM_AREA_BA",
  GRAD_INFO_OFFICER: "GRAD_INFO_OFFICER",
  GRAD_SYSTEM_COORDINATOR: "GRAD_SYSTEM_COORDINATOR"
});

export const MinistryAddress = Object.freeze({
  streetLine1: "4TH FLOOR 620 SUPERIOR",
  streetLine2: "PO BOX 9886 STN PROV GOVT",
  city: "VICTORIA",
  region: "BRITISH COLUMBIA",
  country: "CANADA",
  code: "V8W9T6",
});
