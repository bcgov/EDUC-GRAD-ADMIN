import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";
import {MinistryAddress} from "@/utils/constants.js"

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
    psiYear: null,
    psiTransmissionMode:null,     
    blankCertificateDetails:[],
    blankTranscriptDetails:[],
    credential:null,
    categoryCode:[],
    copies:"1",
    allPsi:false,
    allDistricts:false,
    distribution: null,
    localDownload: "N",
    activityCode: null,

    batchRunTime: null,
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
      console.log("R2")
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
      let date = new Date();
      if (date.getMonth() + 1 > 8) {
        return String(date.getFullYear() + 1);
      } else {
        return String(date.getFullYear());
      }
    },
    getCredential: (state) => {
      return state.credential
    },
    getGroup: (state) => {
      return state.who
    },
    getGroupData: (state) => {
      
      if (state.who === "Student") {
        return state.students.map(student => student.pen);
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
    getPsiYear: (state) => state.psiYear,
    getDistribution: (state) => state.distribution,
    getCopies: (state) => state.copies,
    getBatchRunTime: (state) => state.batchRunTime,
    getActivityCode:(state) => state.activityCode,
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
          console.log("GETTING CUSTOM");
        
          // Extract the date part and construct a new date-time string with the custom time
          let customDate = new Date(state.batchRunCustomDate);
          let customTime = state.batchRunCustomTime + ":00"; // Append seconds to the time to match format
        
          console.log(customDate)
          console.log(customTime)
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
        schoolOfRecords: state.who === "School" ? state.schools.map(school => school.mincode) : [],
        districts: state.who === "School Category" ? state.districts.map(district => district.district) : [],
        programs: state.who === "Program" ? state.programs.map(program => program.program) : [],
        psiCodes: state.who === "Psi" ? state.psi.map(postSecondaryInstitution => postSecondaryInstitution.psi) : [],
        schoolCategoryCodes: state.categoryCode,
        validateInputs: false,
        activityCode: state.activityCode,
        // gradDateFrom and gradDateTo are empty if "Current Students" is selected
        gradDateFrom: state.getFormattedGradDateFrom,
        gradDateTo: state.getFormattedGradDateTo,

        // Include credentialTypeCode based on the credential selected
        ...(state.credential === "Blank certificate print" ? { credentialTypeCode: state.blankCertificateDetails } : {}),
        ...(state.credential === "Blank transcript print" ? { credentialTypeCode: state.blankTranscriptDetails } : {}),

        // User distribution run with specific conditions
        quantity: state.copies,
            // Check distribution method
           
           localDownload: state.getLocalDownload,
          ...(state.distribution === "User" ? {   user: "",
            address: state.getUserDistributionAddress, } : {}),

          
        
      };
      return request
    },   
  }

});
