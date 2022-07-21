let baseRoot = '/api';
const authRoot = baseRoot + '/auth';

let object = {
  LOGIN: authRoot + '/login',
  LOGOUT: authRoot + '/logout',
  SESSION_EXPIRED: authRoot + '/logout?sessionExpired=true',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token',
  USER: authRoot + '/user',
  SESSION_REMAINING_TIME: authRoot + '/user-session-remaining-time',
};

//endpoints
export const Routes = Object.freeze(object);

//roles
export const RolePermissions = Object.freeze(
  {
    ADMINISTRATOR: "GRAD_SYSTEM_COORDINATOR",
  }
)
