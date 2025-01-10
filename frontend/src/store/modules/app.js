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
    getInstituteAddressTypeCodes: (state) => state.instituteAddressTypeCodes,
    getInstituteAddressTypeCode: (state) => {
      return (code) =>
        state.instituteAddressTypeCodes.find(
          (addressTypeCode) => code === addressTypeCode.addressTypeCode
        );
    },
    getInstituteCategoryCodes: (state) => state.instituteCategoryCodes,
    getInstituteCategoryByCode: (state) => {
      return (code) =>
        state.instituteCategoryCodes.find(
          (categoryCode) => code === categoryCode.schoolCategoryCode
        );
    },
    getInstituteFacilityCodes: (state) => state.instituteFacilityCodes,
    getInstituteFacilityCode: (state) => {
      return (code) =>
        state.instituteFacilityCodes.find(
          (facilityCode) => code === facilityCode.facilityTypeCode
        );
    },
    getInstituteGradeCodes: (state) => state.instituteGradeCodes,
    getInstituteGradeCode: (state) => {
      return (code) =>
        state.instituteGradeCodes.find(
          (gradeCode) => code === gradeCode.schoolGradeCode
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

        // SET INSTITUTE SCHOOL AND DISTRICT DATA
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

        // SET INSTITUTE CODES
        InstituteService.getAddressTypeCodes().then((response) => {
          try {
            this.instituteAddressTypeCodes = response.data;
          } catch (error) {
            console.error(error);
          }
        });
        InstituteService.getCategoryCodes().then((response) => {
          try {
            this.instituteCategoryCodes = response.data;
          } catch (error) {
            console.error(error);
          }
        });
        InstituteService.getFacilityCodes().then((response) => {
          try {
            this.instituteFacilityCodes = response.data;
          } catch (error) {
            console.error(error);
          }
        });
        InstituteService.getGradeCodes().then((response) => {
          try {
            this.instituteGradeCodes = response.data;
          } catch (error) {
            console.error(error);
          }
        });
      }
    },
  },
});
