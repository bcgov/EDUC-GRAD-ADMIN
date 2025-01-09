import { defineStore } from "pinia";
import ApiService from "../../common/apiService.js";
import InstituteService from "../../services/InstituteService.js";
import sharedMethods from "../../sharedMethods.js";
export const useAppStore = defineStore("app", {
  state: () => ({
    programOptions: [],
    studentStatusOptions: [],
    ungradReasons: [],
    pageTitle: "GRAD",
    districtsList: [],
    schoolsList: [],
  }),
  getters: {
    getProgramOptions: (state) => state.programOptions,
    getStudentStatusOptions: (state) => state.studentStatusOptions,
    getUngradReasons: (state) => state.ungradReasons,
    getSchoolsList: (state) => state.schoolsList,
    getSchoolById: (state) => {
      return (schoolId) =>
        state.schoolsList.find((school) => schoolId === school.schoolId);
    },
    getDistrictList: (state) => state.districtsList,
    getDistrictById: (state) => {
      return (districtId) =>
        state.districtsList.find(
          (district) => districtId === district.districtId
        );
    },
  },
  actions: {
    setApplicationVariables() {
      if (localStorage.getItem("jwtToken")) {
        ApiService.apiAxios.get("/api/v1/program/programs").then((response) => {
          const programs = response.data.filter((obj) => {
            return obj.programCode !== "NOPROG";
          });
          this.programOptions = programs;
        });

        ApiService.apiAxios
          .get("/api/v1/student/studentstatus")
          .then((response) => {
            try {
              this.studentStatusOptions = response.data;
            } catch (error) {
              console.log(error);
            }
          });

        ApiService.apiAxios
          .get("/api/v1/studentgraduation/undocompletion/undocompletionreason")
          .then((response) => {
            try {
              this.ungradReasons = response.data;
            } catch (error) {
              console.log(error);
            }
          });

        ApiService.apiAxios
          .get("/api/v1/batch/batchjobtype")
          .then((response) => {
            try {
              this.batchTypeCodes = response.data;
            } catch (error) {
              console.log(error);
            }
          });
        InstituteService.getDistrictsList().then((response) => {
          try {
            this.districtsList = response.data;
          } catch (error) {
            console.error(error);
          }
        });
        InstituteService.getSchoolsList().then((response) => {
          try {
            this.schoolsList = response.data;
            this.schoolsList =
              sharedMethods.sortSchoolListByTranscriptsAndMincode(
                this.schoolsList
              );
          } catch (error) {
            console.error(error);
          }
        });
      }
    },
  },
});
