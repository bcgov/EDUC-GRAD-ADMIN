import { defineStore } from "pinia";
import ApiService from "@/common/apiService";
import { Routes, Roles, RolePermissions } from "@/utils/constants";

export const useAccessStore = defineStore("access", {
  namespaced: true,
  state: () => ({
    userAccess: "",
    roles: [],
  }),
  getters: {
    getRoles: (state) => state.roles,
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
    allowOptionalProgramUpdate: (state) => {
      return (
        state.roles.includes(Roles.GRAD_SYSTEM_COORDINATOR) ||
        state.roles.includes(Roles.GRAD_INFO_OFFICER)
      );
    },
    hasPermissions: (state) => {
      return (section, permission) => {
        // Check if the specified section and permission exist
        const permissionData = RolePermissions[section]?.[permission];
        if (!permissionData) {
          return false; // Section or permission does not exist
        }

        // Check if any allowed role matches the user's roles
        return permissionData.allowed.some((role) =>
          state.roles.includes(role)
        );
      };
    },
  },

  actions: {
    async setUserAccess(userAccess) {
      if (userAccess) {
        this.userAccess = userAccess;
      } else {
        this.userAccess = null;
      }
    },
    async setUserRoles(role) {
      if (role) {
        this.roles = role;
      } else {
        this.roles = "unauthorized";
      }
    },
    //sets the token required for refreshing expired json web tokens
    async logoutState() {
      localStorage.removeItem("jwtToken");
      this.userAccess = null;
      this.isAuthenticated = false;
    },

    async setAccess() {
      if (localStorage.getItem("jwtToken")) {
        await ApiService.apiAxios
          .get(Routes.USER)
          .then((response) => {
            this.setUserAccess(response.data.userAccess);
            this.setUserRoles(response.data.userRoles);
          })
          .catch((e) => {
            throw e;
          });
      }
    },
  },
});
