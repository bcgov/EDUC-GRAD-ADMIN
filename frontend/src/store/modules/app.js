import { defineStore } from "pinia";

import CommonService from "@/services/CommonService.js";
import InstituteService from "@/services/InstituteService.js";
import StudentService from "@/services/StudentService.js";
import StudentGraduationService from "@/services/StudentGraduationService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import BatchProcessingService from "@/services/BatchProcessingService.js";

import { useSnackbarStore } from "../../store/modules/snackbar";

import sharedMethods from "@/sharedMethods.js";
export const useAppStore = defineStore("app", {
  state: () => ({
    snackbarStore: useSnackbarStore(),
    pageTitle: "GRAD",
    programOptions: [],
    studentStatusOptions: [],
    ungradReasons: [],
    batchTypeCodes: [],
    transcriptTypes: [],
    certificationTypes: [],
    schoolsList: [],
    schoolsMap: new Map(),
    districtsList: [],
    instituteAddressTypeCodes: [],
    instituteCategoryCodes: [],
    instituteFacilityCodes: [],
    instituteGradeCodes: [],
    config: null,
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
    getSchoolMincodeById: (state) => {
      return (schoolId) => {
        if (schoolId === "00000000-0000-0000-0000-000000000000") {
          // Special school code for Ministry of Advanced Education
          return "Ministry of Advanced Education";
        }
        return state.schoolsList.find((school) => schoolId === school.schoolId)
          ?.mincode;
      };
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
    schoolCategoryCodes: (state) => state.instituteCategoryCodes,
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
    getFacilityCodes: (state) => state.instituteFacilityCodes,
    getFacilityCode: (state) => {
      return (code) =>
        state.instituteFacilityCodes.find(
          (facilityCode) => code === facilityCode.facilityTypeCode
        );
    },
    getGradeCodes: (state) => state.instituteGradeCodes,
    getGradeCode: (state) => {
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
      try {
        if (localStorage.getItem("jwtToken")) {
          // GET & SET CONFIG
          await this.getConfig();
          // GET & SET GRAD CODES
          await this.getProgramOptionCodes();
          await this.getStudentStatusOptionCodes();
          await this.getUndoCompletionReasonCodes();
          await this.getBatchJobTypeCodes();
          await this.getTranscriptTypeCodes();
          await this.getCertificateTypeCodes();
          // GET & SET INSTITUTE SCHOOL AND DISTRICT LISTS
          await this.getSchools();
          await this.getDistricts();
          // GET & SET INSTITUTE CODES
          await this.getInstituteCategoryCodes();
          await this.getInstituteFacilityCodes();
          await this.getInstituteGradeCodes();
        }
      } catch (e) {
        if (e.response.status) {
          this.snackbarStore.showSnackbar(
            "There was an error: " + e.response.status,
            "error",
            5000
          );
        }
      }
    },
    async getConfig() {
      let response = await CommonService.getConfig();
      await this.setConfig(response.data);
    },
    async setConfig(config) {
      this.config = config;
    },
    async getProgramOptionCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.programOptions)) {
        let response = await ProgramManagementService.getGraduationPrograms();
        await this.setProgramOptions(response.data);
      }
    },
    async setProgramOptions(programCodes) {
      // Filter our NOPROG - No Program Specified from API response until business determines how it should be handled
      let filteredProgramCodes = programCodes.filter(
        (programCode) => programCode.programCode !== "NOPROG"
      );
      this.programOptions =
        sharedMethods.applyDisplayOrder(filteredProgramCodes);
    },
    async getStudentStatusOptionCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.studentStatusOptions)
      ) {
        let response = await StudentService.getStudentStatusCodes();
        await this.setStudentStatusOptions(response.data);
      }
    },
    async setStudentStatusOptions(studentStatusCodes) {
      this.studentStatusOptions =
        sharedMethods.applyDisplayOrder(studentStatusCodes);
    },
    async getUndoCompletionReasonCodes(getNewData = true) {
      if (getNewData || !sharedMethods.applyDisplayOrder(this.ungradReasons)) {
        let response = await StudentGraduationService.getUngradReasons();
        await this.setUndoCompletionReasons(response.data);
      }
    },
    async setUndoCompletionReasons(ungradReasonCodes) {
      this.ungradReasons = sharedMethods.applyDisplayOrder(ungradReasonCodes);
    },
    async getBatchJobTypeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.batchTypeCodes)) {
        let response = await BatchProcessingService.getBatchJobTypes();
        await this.setBatchJobTypes(response.data);
      }
    },
    async setBatchJobTypes(batchJobTypeCodes) {
      this.batchTypeCodes = sharedMethods.applyDisplayOrder(batchJobTypeCodes);
    },
    async getTranscriptTypeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.transcriptTypes)) {
        let response = await GraduationReportService.getTranscriptTypes();
        await this.setTranscriptTypes(response.data);
      }
    },
    async setTranscriptTypes(transcriptTypeCodes) {
      this.transcriptTypes =
        sharedMethods.applyDisplayOrder(transcriptTypeCodes);
    },
    async getCertificateTypeCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.certificationTypes)
      ) {
        let response = await GraduationReportService.getCertificateTypes();
        await this.setCertificateTypes(response.data);
      }
    },
    async setCertificateTypes(certificateTypeCodes) {
      this.certificationTypes =
        sharedMethods.applyDisplayOrder(certificateTypeCodes);
    },
    // GET DATA FROM INSTITUTE
    async getSchools(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.schoolsList)) {
        let response = await InstituteService.getSchoolsList();
        await this.setSchoolsList(response.data);
        //await this.setSchoolsMap(response.data);
      }
    },
    async setSchoolsList(schools) {
      this.schoolsList = sharedMethods.sortSchoolList(schools);
    },
    async setSchoolsMap(schools) {
      this.schoolsMap = new Map();
      schools.forEach((element) => {
        this.schoolsMap.set(element.schoolId, { ...element });
      });
    },
    async getDistricts(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.districtsList)) {
        let response = await InstituteService.getDistrictsList();
        await this.setDistrictsList(response.data);
      }
    },
    async setDistrictsList(districts) {
      this.districtsList =
        sharedMethods.sortDistrictListByActiveAndDistrictNumber(districts);
    },
    async getInstituteCategoryCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.instituteCategoryCodes)
      ) {
        let response = await InstituteService.getSchoolCategoryCodes();
        await this.setInstituteCategoryCodes(response.data);
      }
    },
    async setInstituteCategoryCodes(categoryCodes) {
      this.instituteCategoryCodes =
        sharedMethods.applyDisplayOrder(categoryCodes);
    },
    async getInstituteFacilityCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.instituteFacilityCodes)
      ) {
        let response = await InstituteService.getFacilityCodes();
        await this.setInstituteFacilityCodes(response.data);
      }
    },
    async setInstituteFacilityCodes(facilityCodes) {
      this.instituteFacilityCodes =
        sharedMethods.applyDisplayOrder(facilityCodes);
    },
    async getInstituteGradeCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.instituteGradeCodes)
      ) {
        let response = await InstituteService.getGradeCodes();
        await this.setInstituteGradeCodes(response.data);
      }
    },
    async setInstituteGradeCodes(gradeCodes) {
      this.instituteGradeCodes = sharedMethods.applyDisplayOrder(gradeCodes);
    },
  },
});
