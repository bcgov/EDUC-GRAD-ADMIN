import ApiService from "@/common/apiService";
import { Routes, Roles } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    userAccess: "",
    role: "GRAD_SYSTEM_INFO",
  },
  getters: {
    userAccess: (state) => state.userAccess,
    role: (state) => state.role,
    allowRunDistrunYE: (state) => {
      return state.role === roleAcess.GRAD_SYSTEM_COORDINATOR 
    },
    allowRunDistrunMonthly: (state) => {
      return state.role === roleAcess.GRAD_SYSTEM_COORDINATOR 
    },
    allowSelectCategoryCodeGroup: (state) => {
      return state.role === roleAcess.GRAD_SYSTEM_COORDINATOR || state.role === roleAcess.GRAD_SYSTEM_GRAD_INFO_OFFICER
    },
    allowSelectProgramGroup: (state) => {
      return state.role === roleAcess.GRAD_SYSTEM_COORDINATOR || state.role === roleAcess.GRAD_SYSTEM_GRAD_INFO_OFFICER
    }
  },
  mutations: {
    setUserAccess: (state, userAccess) => {
      if (userAccess) {
        state.userAccess = userAccess;
      } else {
        state.userAccess = null;
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
          })
          .catch((e) => {
            throw e;
          });
      }
    },
  },
};
