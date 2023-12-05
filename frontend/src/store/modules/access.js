import ApiService from "@/common/apiService";
import { Routes, Roles } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    userAccess: "",
    roles: [],
  },
  getters: {
    userAccess: (state) => state.userAccess,
    roles: (state) => state.roles,
    allowUpdateGradStatus: (state) => {
      return (
        state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR) ||
        state.roles.includes(Roles.GRAD_INFO_OFFICER)
      );
    },
    allowCreateStudentNotes: (state) => {
      return (
        state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR) ||
        state.roles.includes(Roles.GRAD_INFO_OFFICER)
      );
    },
    allowRunGradAlgorithm: (state) => {
      return (
        state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR) ||
        state.roles.includes(Roles.GRAD_INFO_OFFICER)
      );
    },
    allowCreateBatchJob: (state) => {
      return (
        state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR) ||
        state.roles.includes(Roles.GRAD_INFO_OFFICER)
      );
    },
    allowSelectCategoryCodeGroup: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowSelectProgramGroup: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowRunDistrunYE: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowRunDistrunMonthly: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowRunNonGradRun: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowRunDistrunSupplemental: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowRunPSI: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowToggleRoutines: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
    allowUpdateRecalcFlags: (state) => {
      return state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR);
    },
  },
  mutations: {
    setUserAccess: (state, userAccess) => {
      if (userAccess) {
        state.userAccess = userAccess;
      } else {
        state.userAccess = null;
      }
    },
    setUserRoles: (state, role) => {
      if (role) {
        state.roles = role;
      } else {
        state.roles = "unauthorized";
      }
    },
    //sets the token required for refreshing expired json web tokens
    logoutState: (state) => {
      localStorage.removeItem("jwtToken");
      state.userAccess = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    async getUserAccess(context) {
      if (localStorage.getItem("jwtToken")) {
        await ApiService.apiAxios
          .get(Routes.USER)
          .then((response) => {
            context.commit("setUserAccess", response.data.userAccess);
            context.commit("setUserRoles", response.data.userRoles);
          })
          .catch((e) => {
            throw e;
          });
      }
    },
  },
};
