import ApiService from "@/common/apiService";
import { Routes } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    userAccess: null,
  },
  getters: {
    userAccess: (state) => state.userAccess,
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
