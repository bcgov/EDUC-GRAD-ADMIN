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
