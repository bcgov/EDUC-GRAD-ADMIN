import { defineStore } from "pinia";

import CommonService from "@/services/CommonService.js";
import SchoolsService from "@/services/SchoolsService.js";
import CodesService from "@/services/CodesService.js";
import sharedMethods from "@/sharedMethods.js";
import StudentAssessmentService from "@/services/StudentAssessmentService";

import { useSnackbarStore } from "../../store/modules/snackbar";

export const useAppStore = defineStore("app", {
  state: () => ({
    snackbarStore: useSnackbarStore(),
    pageTitle: "GRAD",
    programOptions: [],
    optionalProgramOptions: [],
    optionalProgramIdToNameMap: {},
    groupedOptionalProgramOptions: [],
    careerProgramOptions: [],
    studentStatusOptions: [],
    ungradReasons: [],
    batchTypeCodes: [],
    transcriptTypes: [],
    certificationTypes: [],
    schoolsList: [],
    schoolsMap: new Map(),
    districtsList: [],
    coregCourses: [],
    coregCoursesMap: new Map(),
    coregExternalCodeMap: new Map(),
    instituteAddressTypeCodes: [],
    instituteCategoryCodes: [],
    instituteFacilityCodes: [],
    studentGradeCodes: [],
    config: null,
    FAASTypeCodes: [],
    provincialSpecialCaseCodes: [],
    assessmentTypeCodesMap: new Map(),
    assessmentTypeCodes: [],
    countryCodes: [],
    citizenshipCodes: [],
    provinceCodes: [],
    currentDate: "",
    currentMonth: "",
    currentYear: "",
  }),
  getters: {
    appEnvironment: (state) =>
      state?.config?.ENVIRONMENT ? state.config.ENVIRONMENT : "",
    getVersion: (state) => (state?.config?.VERSION ? state.config.VERSION : ""),
    getProgramOptions: (state) => state.programOptions,
    getStudentStatusOptions: (state) => state.studentStatusOptions,
    getUngradReasons: (state) => state.ungradReasons,
    getSchoolsList: (state) => state.schoolsList,
    getSchoolById: (state) => {
      return (schoolId) =>
        state.schoolsList.find((school) => schoolId === school.schoolId);
    },
    schoolByMincode: (state) => {
      return (mincode) =>
        state.schoolsList.find((school) => mincode === school.mincode);
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
    getDistrictNumberById: (state) => {
      return (districtId) => {
        return state.districtsList.find(
          (district) => districtId === district.districtId
        )?.districtNumber;
      };
    },
    getDistrictByDistrictNumber: (state) => {
      return (districtNumber) =>
        state.districtsList.find(
          (district) => districtNumber === district.districtNumber
        );
    },
    getCoregCourses: (state) => state.coregCourses,
    getCoregCourseById: (state) => {
      return (courseId) => state.coregCoursesMap.get(courseId);
    },
    getCoregCourseByExternalCode: (state) => {
      return (externalCode) => {
        const courseId = state.coregExternalCodeMap.get(externalCode);
        return courseId ? state.coregCoursesMap.get(courseId) : null;
      };
    },
    getInstituteAddressTypeCodes: (state) => state.instituteAddressTypeCodes,
    getInstituteAddressTypeCode: (state) => {
      return (code) =>
        state.instituteAddressTypeCodes.find(
          (addressTypeCode) => code === addressTypeCode.addressTypeCode
        );
    },
    // We should move to rename these to drop the "get" part to align with student admin and avoid naming conflicts
    schoolCategoryCodes: (state) => state.instituteCategoryCodes,
    optionalProgramsByGradProgram: (state) => (gradProgram) =>
      state.optionalProgramOptions?.filter(
        (optProgram) => optProgram.graduationProgramCode == gradProgram
      ),
    optionalProgramByID: (state) => {
      return (optionalProgramID) =>
        state.optionalProgramOptions?.find(
          (optionalProgram) =>
            optionalProgram.optionalProgramID === optionalProgramID
        );
    },
    getBatchSchoolCategoryCodes: (state) => {
      const includedCategories = [
        "PUBLIC",
        "INDEPEND",
        "FED_BAND",
        "YUKON",
        "OFFSHORE",
      ];
      return state.instituteCategoryCodes.filter((item) =>
        includedCategories.includes(item.schoolCategoryCode)
      );
    },
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
    getStudentAssessmentProvincialSpecialCaseCodes: (state) =>
      state.provincialSpecialCaseCodes,
    getProvincialSpecialCaseCode: (state) => {
      return (code) =>
        state.provincialSpecialCaseCodes.find(
          (specialCase) => code === specialCase.provincialSpecialCaseCode
        );
    },
    getFacilityCodes: (state) => state.instituteFacilityCodes,
    getFacilityCode: (state) => {
      return (code) =>
        state.instituteFacilityCodes.find(
          (facilityCode) => code === facilityCode.facilityTypeCode
        );
    },
    getTranscriptTypes: (state) => state.transcriptTypes,
    getCertificateTypes: (state) => state.certificationTypes,
    enableCRUD: (state) => {
      return state.config?.CRUD_ENABLED;
    },
    showLegacy: (state) => {
      return state.config?.SHOW_LEGACY; // used to flip pre-crud components on/off
    },
    getCurrentDate: (state) => state.currentDate,
  },
  actions: {
    async setCurrentDate() {
      const currentDateObject = sharedMethods.getTodaysDate();
      this.currentDate = currentDateObject.currentDate;
      this.currentMonth = currentDateObject.currentMonth;
      this.currentYear = currentDateObject.currentYear;
    },
    async setApplicationVariables() {
      try {
        if (localStorage.getItem("jwtToken")) {
          await this.setCurrentDate();
          // GET & SET CONFIG
          await this.getConfig();
          // GET & SET GRAD CODES
          await this.getProgramOptionCodes();
          await this.getOptionalProgramCodes();
          await this.getCareerProgramCodes();
          await this.getStudentStatusOptionCodes();
          await this.getUndoCompletionReasonCodes();
          await this.getBatchJobTypeCodes();
          await this.getTranscriptTypeCodes();
          await this.getCertificateTypeCodes();
          await this.getStudentGradeCodes();
          await this.getLetterGradeCodes();
          await this.getFAASTypeCodes();
          //GET & SET ASSESSMENT TYPE CODES
          await this.getAssessmentTypeCodes();
          // GET & SET INSTITUTE SCHOOL AND DISTRICT LISTS
          await this.getSchools();
          await this.getDistricts();
          // GET & SET COREG COURSES
          await this.loadCoregCourses();
          // GET & SET INSTITUTE CODES
          await this.getInstituteCategoryCodes();
          await this.getInstituteFacilityCodes();
          await this.getProvincialSpecialCaseCodes();
          // set current date string
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
        let response = await CodesService.getGradProgramCodes();
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
        let response = await CodesService.getStudentStatusCodes();
        await this.setStudentStatusOptions(response.data);
      }
    },
    async setStudentStatusOptions(studentStatusCodes) {
      this.studentStatusOptions =
        sharedMethods.applyDisplayOrder(studentStatusCodes);
    },
    async getOptionalProgramCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.optionalProgramOptions)
      ) {
        let response = await CodesService.getOptionalProgramCodes();
        await this.setOptionalProgramCodes(response.data); // why does this line throw error
      }
    },
    async setOptionalProgramCodes(optionalProgramCodes) {
      this.optionalProgramOptions =
        sharedMethods.applyDisplayOrder(optionalProgramCodes);

      await this.setGroupedOptionalProgramCodes(optionalProgramCodes);
    },
    async setGroupedOptionalProgramCodes(optionalProgramCodes) {
      // Group by optionalProgramName to handle duplicates across different graduation programs
      const groupedByName = {};
      const idToNameMap = {};

      optionalProgramCodes.forEach(program => {
        const name = program.optionalProgramName;
        const id = program.optionalProgramID;

        idToNameMap[id] = name;

        if (!groupedByName[name]) {
          groupedByName[name] = {
            ...program,
            allOptionalProgramIDs: [id]
          };
        } else {
          groupedByName[name].allOptionalProgramIDs.push(id);
        }
      });

      const uniquePrograms = Object.values(groupedByName);
      this.groupedOptionalProgramOptions = sharedMethods.applyDisplayOrder(uniquePrograms);

      this.optionalProgramIdToNameMap = idToNameMap;
    },
    async getCareerProgramCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.careerProgramOptions)
      ) {
        let response = await CodesService.getCareerProgramCodes();
        await this.setCareerProgramCodes(response.data); // why does this line throw error
      }
    },
    async setCareerProgramCodes(careerProgramCodes) {
      this.careerProgramOptions =
        sharedMethods.applyDisplayOrder(careerProgramCodes);
    },
    async getUndoCompletionReasonCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.ungradReasons)) {
        let response = await CodesService.getUndoCompletionReasonCodes();
        await this.setUndoCompletionReasons(response.data);
      }
    },
    async setUndoCompletionReasons(ungradReasonCodes) {
      this.ungradReasons = sharedMethods.applyDisplayOrder(ungradReasonCodes);
    },
    async getBatchJobTypeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.batchTypeCodes)) {
        let response = await CodesService.getBatchJobTypes();
        await this.setBatchJobTypes(response.data);
      }
    },
    async setBatchJobTypes(batchJobTypeCodes) {
      this.batchTypeCodes = sharedMethods.applyDisplayOrder(batchJobTypeCodes);
    },
    async getTranscriptTypeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.transcriptTypes)) {
        let response = await CodesService.getTranscriptTypeCodes();
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
        let response = await CodesService.getCertificateTypeCodes();
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
        let response = await SchoolsService.getSchoolsList();
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
        let response = await SchoolsService.getDistrictsList();
        await this.setDistrictsList(response.data);
      }
    },
    async setDistrictsList(districts) {
      this.districtsList =
        sharedMethods.sortDistrictListByActiveAndDistrictNumber(districts);
    },
    async loadCoregCourses(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.coregCourses)) {
        const ApiService = (await import('@/common/apiService.js')).default;
        let response = await ApiService.getCoregCourses();
        await this.setCoregCourses(response.data);
      }
    },
    async setCoregCourses(courses) {
      this.coregCourses = courses;
      this.coregCoursesMap = new Map();
      this.coregExternalCodeMap = new Map();
      courses.forEach((course) => {
        this.coregCoursesMap.set(course.courseID, course);
        if (course.externalCode) {
          this.coregExternalCodeMap.set(course.externalCode, course.courseID);
        }
      });
    },
    async getInstituteCategoryCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.instituteCategoryCodes)
      ) {
        let response = await CodesService.getSchoolCategoryCodes();
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
        let response = await CodesService.getFacilityCodes();
        await this.setInstituteFacilityCodes(response.data);
      }
    },
    async setInstituteFacilityCodes(facilityCodes) {
      this.instituteFacilityCodes =
        sharedMethods.applyDisplayOrder(facilityCodes);
    },
    async getStudentGradeCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.studentGradeCodes)
      ) {
        let response = await CodesService.getStudentGradeCodes();
        await this.setStudentGradeCodes(response.data);
      }
    },
    async setStudentGradeCodes(gradeCodes) {
      this.studentGradeCodes = sharedMethods.filterActiveObjects(
        sharedMethods.applyDisplayOrder(gradeCodes)
      );
    },
    async getCountryCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.countryCodes)
      ) {
        let response = await CodesService.getCountryCodes();
        await this.setCountryCodes(response.data);
      }
    },
    async setCountryCodes(countryCodes) {
      this.countryCodes = countryCodes;
    },
    async getCitizenshipCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.citizenshipCodes)
      ) {
        let response = await CodesService.getCitizenshipCodes();
        await this.setCitizenshipCodes(response.data);
      }
    },
    async setCitizenshipCodes(citizenshipCodes) {
      this.citizenshipCodes = citizenshipCodes;
    },
    async getProvinceCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.provinceCodes)
      ) {
        let response = await CodesService.getProvinceCodes();
        await this.setProvinceCodes(response.data);
      }
    },
    async setProvinceCodes(provinceCodes) {
      this.provinceCodes = provinceCodes;
    },
    async setLetterGrades(letterGrades) {
      this.letterGradeCodes = letterGrades;
    },
    async getLetterGradeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.letterGradeCodes)) {
        let response = await CodesService.getLetterGradeCodes();
        await this.setLetterGrades(response.data);
      }
    },
    async setFAASTypeCodes(FAASTypeCodes) {
      this.FAASTypeCodes = FAASTypeCodes;
    },
    async getFAASTypeCodes(getNewData = true) {
      if (getNewData || !sharedMethods.dataArrayExists(this.FAASTypeCodes)) {
        let response = await CodesService.getFineArtsAppliedSkillsTypes();
        await this.setFAASTypeCodes(response.data);
      }
    },
    async setAssessmentTypeCodes(assessmentTypeCodes) {
      this.assessmentTypeCodes =
        sharedMethods.applyDisplayOrder(assessmentTypeCodes);
      this.assessmentTypeCodesMap = new Map(
        this.assessmentTypeCodes.map((type) => [type.assessmentTypeCode, type])
      );
    },
    async getAssessmentTypeCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.assessmentTypeCodes)
      ) {
        let response = await StudentAssessmentService.getAssessmentTypeCodes();
        await this.setAssessmentTypeCodes(response.data);
      }
    },
    async getProvincialSpecialCaseCodes(getNewData = true) {
      if (
        getNewData ||
        !sharedMethods.dataArrayExists(this.provincialSpecialCaseCodes)
      ) {
        let response =
          await StudentAssessmentService.getProvincialSpecialCaseCodes();
        await this.setProvincialSpecialCaseCodes(response.data);
      }
    },
    setProvincialSpecialCaseCodes(provincialSpecialCaseCodes) {
      this.provincialSpecialCaseCodes = sharedMethods.applyDisplayOrder(
        provincialSpecialCaseCodes
      );
    },
  },
});
