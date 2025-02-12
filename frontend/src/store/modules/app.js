import { defineStore } from "pinia";
import ApiService from "../../common/apiService.js";
import InstituteService from "../../services/InstituteService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import sharedMethods from "../../sharedMethods.js";
export const useAppStore = defineStore("app", {
  state: () => ({
    pageTitle: "GRAD",
    programOptions: [],
    studentStatusOptions: [],
    ungradReasons: [],
    batchTypeCodes: [],
    transcriptTypes: [],
    certificationTypes: [],
    schoolsList: [],
    districtsList: [],
    instituteAddressTypeCodes: [],
    instituteCategoryCodes: [],
    instituteFacilityCodes: [],
    instituteGradeCodes: [],
  }),
  getters: {
    getProgramOptions: (state) => state.programOptions,
    getStudentStatusOptions: (state) => state.studentStatusOptions,
    getUngradReasons: (state) => state.ungradReasons,
    getSchoolsList: (state) => state.schoolsList,
    getSchoolById: (state) => {
      if (!sharedMethods.dataArrayExists(state.schoolsList)) {
        getSchoolsList();
      }
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
    displaySchoolCategoryCode: (state) => (code) => {
      const categoryCode = state.instituteCategoryCodes.find(
        (categoryCode) => code === categoryCode.schoolCategoryCode
      );

      return categoryCode?.legacyCode + " - " + categoryCode?.label;
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
    getTranscriptTypes: (state) => state.transcriptTypes,
    getCertificateTypes: (state) => state.certificationTypes,
  },
  actions: {
    async setApplicationVariables() {
      if (localStorage.getItem("jwtToken")) {
        await this.setProgramOptions();
        await this.setStudentStatusOptions();
        await this.setUndoCompletionReasons();
        await this.setBatchJobTypes();
        await this.setTranscriptTypes();
        await this.setCertificateTypes();
        // SET INSTITUTE SCHOOL AND DISTRICT DATA
        await this.setSchoolsList();
        await this.setDistrictsList();
        // SET INSTITUTE CODES
        await this.setInstituteCategoryCodes();
        await this.setInstituteFacilityCodes();
        await this.setInstituteGradeCodes();
      }
    },
    async setProgramOptions() {
      await ApiService.apiAxios
        .get("/api/v1/program/programs")
        .then((response) => {
          const programs = response.data.filter((obj) => {
            return obj.programCode !== "NOPROG";
          });
          this.programOptions = sharedMethods.applyDisplayOrder(programs);
        });
    },
    async setStudentStatusOptions() {
      await ApiService.apiAxios
        .get("/api/v1/student/studentstatus")
        .then((response) => {
          try {
            this.studentStatusOptions = sharedMethods.applyDisplayOrder(
              response.data
            );
          } catch (error) {
            console.log(error);
          }
        });
    },
    async setUndoCompletionReasons() {
      await ApiService.apiAxios
        .get("/api/v1/studentgraduation/undocompletion/undocompletionreason")
        .then((response) => {
          try {
            this.ungradReasons = sharedMethods.applyDisplayOrder(response.data);
          } catch (error) {
            console.log(error);
          }
        });
    },
    async setBatchJobTypes() {
      await ApiService.apiAxios
        .get("/api/v1/batch/batchjobtype")
        .then((response) => {
          try {
            this.batchTypeCodes = sharedMethods.applyDisplayOrder(
              response.data
            );
          } catch (error) {
            console.log(error);
          }
        });
    },
    async setTranscriptTypes() {
      await GraduationReportService.getTranscriptTypes().then((response) => {
        try {
          this.transcriptTypes = sharedMethods.applyDisplayOrder(response.data);
        } catch (error) {
          if (error.response.statusText) {
            console.log("ERROR " + error.response.statusText, "danger");
          } else {
            console.log("ERROR " + "error with webservice", "danger");
          }
        }
      });
    },
    async setCertificateTypes() {
      await GraduationReportService.getCertificateTypes().then((response) => {
        try {
          this.certificationTypes = sharedMethods.applyDisplayOrder(
            response.data
          );
        } catch (error) {
          if (error.response.statusText) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error.response.statusText,
              "danger",
              10000
            );
          } else {
            this.snackbarStore.showSnackbar(
              "ERROR " + "error with web service",
              "danger",
              10000
            );
          }
        }
      });
    },
    // SET DATA FROM INSTITUTE
    async setSchoolsList() {
      await InstituteService.getSchoolsList().then((response) => {
        try {
          this.schoolsList =
            sharedMethods.sortSchoolListByTranscriptsAndMincode(response.data);
        } catch (error) {
          console.error(error);
        }
      });
    },
    async setDistrictsList() {
      await InstituteService.getDistrictsList().then((response) => {
        try {
          this.districtsList =
            sharedMethods.sortDistrictListByActiveAndDistrictNumber(
              response.data
            );
        } catch (error) {
          console.error(error);
        }
      });
    },
    async setInstituteCategoryCodes() {
      await InstituteService.getSchoolCategoryCodes().then((response) => {
        try {
          this.instituteCategoryCodes = sharedMethods.applyDisplayOrder(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      });
    },
    async setInstituteFacilityCodes() {
      await InstituteService.getFacilityCodes().then((response) => {
        try {
          this.instituteFacilityCodes = sharedMethods.applyDisplayOrder(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      });
    },
    async setInstituteGradeCodes() {
      await InstituteService.getGradeCodes().then((response) => {
        try {
          this.instituteGradeCodes = sharedMethods.applyDisplayOrder(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      });
    },
  },
});
