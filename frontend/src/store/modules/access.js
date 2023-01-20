import ApiService from "@/common/apiService";
import { Routes, RoleAccess } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    userAccess: "",
    UpdateGradStatus: RoleAccess.UPDATE_GRAD_GRADUATION_STATUS,
    CreateStudentNotes: RoleAccess.CREATE_GRAD_STUDENT_NOTES_DATA,
    RunGradAlgorithm: RoleAccess.RUN_GRAD_ALGORITHM,
    CreateBatchJob: RoleAccess.CREATE_GRAD_BATCH_JOB_CODE_DATA,
  },
  getters: {
    userAccess: (state) => state.userAccess,
    allowUpdateGradStatus: (state) =>
      state.userAccess.includes(state.UpdateGradStatus),
    allowCreateStudentNotes: (state) =>
      state.userAccess.includes(state.CreateStudentNotes),
    allowRunGradAlgorithm: (state) =>
      state.userAccess.includes(state.RunGradAlgorithm),
    allowCreateBatchJob: (state) =>
      state.userAccess.includes(state.CreateBatchJob),
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
