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
export const RolePermissions = Object.freeze({
  ADMINISTRATOR: "GRAD_SYSTEM_COORDINATOR",
  BATCH_READER: "Batch Reader",
});

//role access
export const RoleAccess = Object.freeze({
  UPDATE_GRAD_GRADUATION_STATUS: "UPDATE_GRAD_GRADUATION_STATUS",
  CREATE_GRAD_STUDENT_NOTES_DATA: "CREATE_GRAD_STUDENT_NOTES_DATA",
});

export const MinistryAddressLabel = Object.freeze({
  TO: "Ministry of Education and Child Care",
  ADDRESS: "4TH FLOOR 620 SUPERIOR",
  PO: "PO BOX 9886 STN PROV GOVT",
  CITY: "VICTORIA",
  PROVINCE: "BC BRITISH COLUMBIA",
  POSTAL: "V8W9T6",
});
