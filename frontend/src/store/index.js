import Vue from "vue";
import Vuex from "vuex";
import batchprocessing from "@/store/modules/batchprocessing.js";
import useraccess from "@/store/modules/access.js";
import app from "@/store/modules/app.js";
import auth from "@/store/modules/auth.js";
import SchoolService from "@/services/SchoolService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";
Vue.use(Vuex);

export default new Vuex.Store({
  init: {
    //Initialize the store
  },
  state: {
    advancedSearchProps: "",
    tokenTimeout: "",
    isAuthenticated: localStorage.getItem("jwtToken") !== null,
    token: "",
    refreshToken: "",
    correlationID: "",
    roles: "administrator",
    permissions: "",
    username: "",
    pageTitle: null,
    quickSearchPen: "",
    student: {
      profile: {},
      courses: "not loaded",
      assessments: "not loaded",
      exams: "not loaded",
      notes: [],
      gradStatus: "not loaded",
      optionalPrograms: "not loaded",
      hasExams: false,
      hasAssessments: false,
      hasCourses: false,
      hasGradStatus: false,
      hasgradStatusPendingUpdates: false,
      hasNotes: false,
      certificates: [],
      reports: [],
      transcripts: [],
      xmlReports: [],
      ungradReasons: "",
      careerPrograms: [],
      auditHistory: [],
      auditHistoryOptionalPrograms: [],
    },
  },
  mutations: {
    setPageTitle: (state, pageTitle) => {
      state.pageTitle = pageTitle;
    },
    setTabLoading(state, payload) {
      state.batchTabsLoading[payload["index"]] = payload["value"];
    },
    addValueToTypeInBatchId(state, payload) {
      state.batchDetails[payload["id"]][payload["type"]].push({});
    },
    addTypeToBatchId(state, payload) {
      state.batchDetails[payload["id"]][payload["type"]].push({});
    },
    addSchoolToBatch(state, payload) {
      state.batchDetails[payload].schools.push({});
    },
    addDistrictToBatch(state, payload) {
      state.batchDetails[payload].districts.push({});
    },
    addStudentToBatch(state, payload) {
      state.batchDetails[payload].students.push({});
    },

    //id, type, value
    deleteValueFromTypeInBatchId(state, payload) {
      let items = state.batchDetails[payload["id"]][payload["type"]];

      for (var i = 0; i < items.length; i++) {
        if (items[i].value === payload["value"]) {
          items.splice(i--, 1);
        }
      }
      if (items.length == 0) {
        items.push({});
      }
    },

    setStudentAuditHistory(state, payload) {
      state.student.auditHistory = payload;
    },
    setStudentOptionalProgramsAuditHistory(state, payload) {
      state.student.auditHistoryOptionalPrograms = payload;
    },
    setStudentCareerPrograms(state, payload) {
      state.student.careerPrograms = payload;
    },
    setAdvancedSearchProps(state, payload) {
      state.advancedSearchProps = payload;
    },
    setStudentUngradReasons(state, payload) {
      state.student.ungradReasons = payload;
    },
    setStudentCertificates(state, payload) {
      state.student.certificates = payload;
    },
    setStudentReports(state, payload) {
      state.student.reports = payload;
    },
    setStudentTranscripts(state, payload) {
      state.student.transcripts = payload;
    },
    setStudentXmlReport(state, payload) {
      state.student.xmlReports = payload;
    },
    setUsername(state, payload) {
      state.username = payload;
    },
    setQuickSearchPen(state, payload) {
      state.quickSearchPen = payload;
    },
    setPermissions(state, payload) {
      state.permissions = payload;
    },
    setStudentGradStatusOptionalPrograms(state, payload) {
      state.student.optionalPrograms = payload;
      for (let optionalProgram of state.student.optionalPrograms) {
        optionalProgram.studentOptionalProgramData = JSON.parse(
          optionalProgram.studentOptionalProgramData
        );
      }
    },
    setHasGradStatusPendingUpdates(state, payload) {
      state.student.hasGradStatusPendingUpdates = payload;
    },

    // TO DO ADD THIS TO AUTH
    setToken(state, payload = null) {
      localStorage.setItem("jwt", payload);
      state.token = payload;
    },
    setRefreshToken(state, payload) {
      localStorage.setItem("refresh", payload);
      state.refreshToken = payload;
    },
    setCorrelationID(state, payload) {
      localStorage.setItem("correlationID", payload);
      state.correlationID = payload;
    },
    setStudentProfile(state, payload) {
      state.student.profile = payload;
    },
    setStudentCourses(state, payload) {
      state.student.courses = payload;
      if (state.student.courses.length) {
        state.student.hasCourses = true;
      }
    },
    setStudentNotes(state, payload) {
      state.student.notes = payload;
      if (state.student.notes.length) {
        state.student.hasNotes = true;
      }
    },
    setStudentGradStatus(state, payload) {
      state.student.gradStatus = payload;
      //when commiting gradstatus to store, we need to put the json string in to a json object to call it easier
      if (state.student.gradStatus.studentGradData) {
        state.student.gradStatus.studentGradData = JSON.parse(
          state.student.gradStatus.studentGradData
        );
      } else {
        state.student.gradStatus.studentGradData = {};
      }
      if (
        state.student.gradStatus != "not loaded" ||
        state.student.gradStatus == ""
      ) {
        state.student.hasGradStatus = true;
      }
    },
    setStudentAssessments(state, payload) {
      state.student.assessments = payload;
      if (state.student.assessments.length) {
        state.student.hasAssessments = true;
      }
    },
    setStudentExams(state, payload) {
      state.student.exams = payload;
      if (state.student.exams.length) {
        state.student.hasExams = true;
      }
    },
    unsetStudent(state) {
      state.student.profile = {};
      state.student.notes = [];
      state.student.id = "not loaded";
      state.student.courses = "not loaded";
      state.student.assessments = "not loaded";
      state.student.exams = "not loaded";
      state.student.gradStatus = "not loaded";
      state.student.optionalPrograms = "not loaded";
      state.student.hasExams = false;
      state.student.hasAssessments = false;
      state.student.hasCourses = false;
      state.student.hasNotes = false;
      state.student.hasGradStatus = false;
      state.student.hasgradStatusPendingUpdates = false;
      state.student.certificates = [];
      state.student.reports = [];
      state.student.transcripts = [];
      state.student.xmlReports = [];
      state.student.ungradReasons = [];
      state.student.careerPrograms = [];
    },
    setRoles(state, payload) {
      state.roles = payload;
    },
  },
  actions: {
    setUsername({ commit }, payload) {
      commit("setUsername", payload);
    },
    setQuickSearchPen({ commit }, payload) {
      commit("setQuickSearchPen", payload);
    },
    setPermissions({ commit }, payload) {
      commit("setPermissions", payload);
    },
    // Programs
    createProgram({ state }, payload) {
      ProgramManagementService.createProgram(payload, state.auth.token)
        .then((response) => {
          return "STORE REspsonse to display table" + response;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    deleteProgram({ state }, payload) {
      ProgramManagementService.deleteProgram(payload, state.auth.token)
        .then(() => {
          // eslint-disable-next-line
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    updateProgram({ state }, payload) {
      ProgramManagementService.updateProgram(payload, state.auth.token)
        .then(() => {})
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    // Optional Programs
    createOptionalProgram({ state }, payload) {
      ProgramManagementService.createOptionalProgram(payload, state.auth.token)
        .then(() => {})
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    deleteOptionalProgram({ state }, payload) {
      ProgramManagementService.deleteOptionalProgram(payload, state.auth.token)
        .then(() => {})
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    updateOptionalProgram({ state }, payload) {
      ProgramManagementService.updateOptionalProgram(payload, state.auth.token)
        .then(() => {})
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    getGraduationPrograms() {
      ProgramManagementService.getGraduationPrograms()
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    setStudentAuditHistory({ commit }, payload) {
      commit("setStudentAuditHistory", payload);
    },
    setStudentOptionalProgramsAuditHistory({ commit }, payload) {
      commit("setStudentOptionalProgramsAuditHistory", payload);
    },
    setStudentCareerPrograms({ commit }, payload) {
      commit("setStudentCareerPrograms", payload);
    },
    setStudentCertificates({ commit }, payload) {
      commit("setStudentCertificates", payload);
    },
    setStudentReports({ commit }, payload) {
      commit("setStudentReports", payload);
    },
    setStudentTranscripts({ commit }, payload) {
      commit("setStudentTranscripts", payload);
    },
    setStudentXmlReport({ commit }, payload) {
      commit("setStudentXmlReport", payload);
    },
    setAdvancedSearchProps({ commit }, payload) {
      commit("setAdvancedSearchProps", payload);
    },
    setStudentUngradReasons({ commit }, payload) {
      commit("setStudentUngradReasons", payload);
    },
    setHasGradStatusPendingUpdates({ commit }, payload) {
      commit("setHasGradStatusPendingUpdates", payload);
    },
    setStudentGradStatusOptionalPrograms({ commit }, payload) {
      commit("setStudentGradStatusOptionalPrograms", payload);
    },
    setStudentProfile({ commit }, payload) {
      commit("setStudentProfile", payload[0]);
    },
    setStudentCourses({ commit }, payload) {
      commit("setStudentCourses", payload);
    },
    setStudentAssessments({ commit }, payload) {
      commit("setStudentAssessments", payload);
    },
    setStudentExams({ commit }, payload) {
      commit("setStudentExams", payload);
    },
    setStudentGradStatus({ commit }, payload) {
      commit("setStudentGradStatus", payload);
    },
    setRoles({ commit }, payload) {
      commit("setRoles", payload);
    },
    setStudentNotes({ commit }, payload) {
      commit("setStudentNotes", payload);
    },
    // SEARCH
    searchSchools({ state }, payload) {
      SchoolService.searchSchools(payload, state.auth.token)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
  },
  getters: {
    getStudentAuditHistory(state) {
      return state.student.auditHistory;
    },
    getStudentOptionalProgramAuditHistory(state) {
      return state.student.auditHistoryOptionalPrograms;
    },
    getAdvancedSearchProps(state) {
      return state.advancedSearchProps;
    },
    getStudentUngradReasons(state) {
      return state.student.ungradReasons;
    },
    getStudentCertificates(state) {
      return state.student.certificates;
    },
    getStudentReports(state) {
      return state.student.reports;
    },
    getStudentTranscripts(state) {
      return state.student.transcripts;
    },
    getStudentXmlReports(state) {
      return state.student.xmlReports;
    },
    getStudentGraduationCreationAndUpdate(state) {
      return {
        createdBy: state.student.gradStatus.createdBy,
        createdTimestamp: state.student.gradStatus.createdTimestamp,
        updatedBy: state.student.gradStatus.updatedBy,
        updatedTimestamp: state.student.gradStatus.updatedTimestamp,
      };
    },
    getHasGradStatusPendingUpdates(state) {
      return state.student.hasGradStatusPendingUpdates;
    },
    getStudentId(state) {
      return state.student.profile.studentID;
    },
    getStudentProfile(state) {
      return state.student.profile;
    },
    getStudentFullName(state) {
      return {
        legalLastName: state.student.profile.legalLastName,
        legalFirstName: state.student.profile.legalFirstName,
        legalMiddleNames: state.student.profile.legalMiddleNames,
        pen: state.student.profile.pen,
      };
    },
    getStudentPen(state) {
      return state.student.profile.pen;
    },
    getStudentGradStatus(state) {
      return state.student.gradStatus;
    },
    getStudentOptionalPrograms(state) {
      return state.student.optionalPrograms;
    },
    getStudentCourses(state) {
      return state.student.courses;
    },
    getStudentExams(state) {
      return state.student.exams;
    },
    getStudentAssessments(state) {
      return state.student.assessments;
    },
    getStudentNotes(state) {
      return state.student.notes;
    },
    studentHasCourses(state) {
      return state.student.hasCourses;
    },
    studentHasExams(state) {
      return state.student.hasExams;
    },
    studentHasAssessments(state) {
      return state.student.hasAssessments;
    },
    studentHasGradStatus(state) {
      return state.student.hasGradStatus;
    },
    studentHasNotes(state) {
      return state.student.hasNotes;
    },
    gradStatusCourses(state) {
      if (
        state.student.gradStatus.studentGradData &&
        state.student.gradStatus.studentGradData.studentCourses
      ) {
        return state.student.gradStatus.studentGradData.studentCourses
          .studentCourseList;
      } else {
        return {};
      }
    },
    gradStatusAssessments(state) {
      if (
        state.student.gradStatus.studentGradData &&
        state.student.gradStatus.studentGradData.studentAssessments
      ) {
        return state.student.gradStatus.studentGradData.studentAssessments
          .studentAssessmentList;
      } else {
        return {};
      }
    },

    getRoles(state) {
      return state.roles;
    },
    isAdmin(state) {
      return state.roles == "administrator";
    },
    isAuthenticated(state) {
      return state.roles == "authenticated";
    },
    getPermissions(state) {
      return state.permissions;
    },
    getUsername(state) {
      return state.username;
    },
    getQuickSearchPen(state) {
      return state.quickSearchPen;
    },
    getRequirementsMet(state) {
      if (state.student.gradStatus.studentGradData) {
        return state.student.gradStatus.studentGradData.requirementsMet;
      } else {
        return {};
      }
    },
    getNongradReasons(state) {
      if (state.student.gradStatus.studentGradData) {
        return state.student.gradStatus.studentGradData.nonGradReasons;
      } else {
        return {};
      }
    },
    getStudentCareerPrograms(state) {
      return state.student.careerPrograms;
    },
  },
  modules: {
    app,
    auth,
    batchprocessing,
    useraccess,
  },
});
