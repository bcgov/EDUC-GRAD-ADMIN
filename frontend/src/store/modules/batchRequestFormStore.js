import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";
import {MinistryAddress} from "@/utils/constants.js"
function  getCurrentPSIYear() {
  let date = new Date();
  if (date.getMonth() + 1 > 8) {
    return String(date.getFullYear() + 1);
  } else {
    return String(date.getFullYear());
  }
}
export const useBatchRequestFormStore = defineStore("batchRequestFormStore", {
  namespaced: true,
  state: () => ({
    runType: "",
    schools: [],
    districts: [],
    programs:[],
    students:[],
    psi:[],
    who:null,
    where:"BC Mail",
    gradDate:"Current Students",
    gradDateFrom: null,
    gradDateTo: null,
    psiYear:  getCurrentPSIYear(),
    psiTransmissionMode:null,     
    blankCertificateDetails:[],
    blankTranscriptDetails:[],
    credential:null,
    categoryCode:"",
    copies:"1",
    allPsi:false,
    allDistricts:false,
    distribution: "BC Mail",
    localDownload: "N",
    activityCode: null,
    reportType: null,

    batchRunTime: 'Run Now',
    batchRunSchedule: null,
    batchRunCustomDate: null,
    batchRunCustomTime: null
  }),
  actions: {
  async setBatchRunType(payload){
    this.runType = payload
  },
  async clearBatchGroupData(){
    this.schools=[];
    this.districts=[];
    this.programs=[];
    this.students=[];
    this.psi=[];
  }, 
    async clearBatchDetails(payload){
      this.$reset();
    },    
    async clearBatchGroupDetails(payload){
      this.batchDetails[payload].schools=[{}];
      this.batchDetails[payload].districts=[{}];
      this.batchDetails[payload].programs=[{}];
      this.batchDetails[payload].students=[{}];
      this.batchDetails[payload].psi=[{}];
    },  
    async clearBatchCredentialsDetails(payload){
      this.batchDetails[payload].details['blankCertificateDetails']=[{}];
      this.batchDetails[payload].details['blankTranscriptDetails']=[{}];
    },
    async setCredential(payload){
      this.credential = payload
    }, 
    async updateCredential(credential) {
      this.credential = credential;
      this.resetBlankCertificateDetails();
      this.resetBlankTranscriptDetails();
    },    
    async resetBlankCertificateDetails() {
      this.blankCertificateDetails = [];
    },
    async resetBlankTranscriptDetails() {
      this.blankTranscriptDetails = [];
    },
    async setGroup(payload){
      this.who = payload;
    },
    async setActivityCode(payload){
      this.activityCode = payload;
    }
    
  },
  getters: {
    getCurrentPSIYear() {
      return getCurrentPSIYear();  // Still available as a getter
    },
    getCredential: (state) => {
      return state.credential
    },
    getGroup: (state) => {
      return state.who
    },
    getGroupData: (state) => {
      
      if (state.who === "Student") {
        return state.students;
      } else if (state.who === "School Category") {
        return state.districts;
      } else if (state.who === "Program") {
        return state.programs;
      } else if (state.who === "School") {
        return state.schools;
      } else if (state.who === "Psi") {
        return state.psi;
      } else {
        // Return an empty array for any other value
        return [];
      }
    },
    getReportType: (state) => state.reportType,
    getPsiYear: (state) => state.psiYear,
    getPsiTrasmissionMode: (state) => state.psiTransmissionMode,
    getDistribution: (state) => state.distribution,
    getCopies: (state) => state.copies,
    getBatchRunTime: (state) => state.batchRunTime,
    getActivityCode:(state) => state.activityCode,
    getSchoolCategory: (state) => state.categoryCode,
    getLocalDownload: (state) => state.distribution == "Download"?"Y":"N", 
    getBatchRequestCrontime: (state) => {   
        if (state.batchRunSchedule == "N") {
          let today = new Date();
          return (
            "0 30 18 " + today.getDate() + " " + (today.getMonth() + 1) + " *"
          );
        } else if (state.batchRunSchedule == "W") {
          const today = new Date();
          const first = today.getDate() - today.getDay() + 1;
          const sixth = first + 5;
          const saturday = new Date(today.setDate(sixth));
          return (
            "0 30 18 " +
            saturday.getDate() +
            " " +
            (saturday.getMonth() + 1) +
            " *"
          );
        } else if (state.batchRunSchedule == "M") {
          const today = new Date();
          let tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return (
            "0 30 18 " +
            tomorrow.getDate() +
            " " +
            (tomorrow.getMonth() + 1) +
            " *"
          );
        } else if (state.batchRunSchedule == "Custom") {
        
          // Extract the date part and construct a new date-time string with the custom time
          let customDate = new Date(state.batchRunCustomDate);
          let customTime = state.batchRunCustomTime + ":00"; // Append seconds to the time to match format
          // Combine the date and custom time into a new Date object
          let dateTime = new Date(
            customDate.toISOString().split("T")[0] + "T" + customTime
          );
        
          return (
            dateTime.getSeconds() +        // Seconds
            " " + dateTime.getMinutes() +  // Minutes
            " " + dateTime.getHours() +    // Hours
            " " + dateTime.getDate() +     // Day of the month
            " " + (dateTime.getMonth() + 1) + // Month (0-based in JS, hence +1)
            " *"                           // Wildcard for "day of the week"
          );
        } else {
          return null;
        }

    },
    getBlankCertificateDetails:(state) => state.blankCertificateDetails,
    getBlankTranscriptDetails : (state) => state.blankTranscriptDetails,
    getUserDistributionAddress: (state) =>{
      return MinistryAddress
    },
    getFormattedGradDateFrom: (state) => {
      if(state.gradDateFrom){
      const date = new Date(state.gradDateFrom);
      return date.toISOString().split('T')[0];
      }else {
        return null;
      }
    },
    getFormattedGradDateTo: (state) => {
      if(state.gradDateTo){
        const date = new Date(state.gradDateTo);
        return date.toISOString().split('T')[0];
      }else{
        return null;
      }
      
    },

    
    getBatchRequest: (state) => {
      let request = {
        runtype: state.runType,
        pens: state.who === "Student" ? state.students.map(student => student.pen) : [],
        schoolIds: state.who === "School" ? state.schools.map(school => school.info.schoolId) : [],
        districtIds: state.who === "School Category" ? state.districts.map(district => district.info.districtId) : [],
        programs: state.who === "Program" ? state.programs.map(program => program.program) : [],
        psiCodes: state.who === "Psi" ? state.psi.map(postSecondaryInstitution => postSecondaryInstitution.psi) : [],
        psiYear: state.psiYear ? state.psiYear : "",
        psiTransmissionMode: state.psiTransmissionMode,
        schoolCategoryCodes: state.categoryCode ? [state.categoryCode] : [],
        validateInput: true,
        activityCode: state.activityCode,
        reportTypes: state.reportType ? [state.reportType] : [],
        gradDateFrom: state.getFormattedGradDateFrom,
        gradDateTo: state.getFormattedGradDateTo,
        credentialTypeCode: [
          ...state.blankCertificateDetails,
          ...state.blankTranscriptDetails
        ],
    
        quantity: state.copies,
        localDownload: state.getLocalDownload,
        ...(state.distribution === "User" ? { user: "", address: state.getUserDistributionAddress } : {}),
        runMode: "Y",
      };
      return request;
    },
    
  }

});
