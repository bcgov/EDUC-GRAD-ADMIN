import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";

export const useBatchRequestFormStore = defineStore("batchRequestFormStore", {
  namespaced: true,
  state: () => ({
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
    localDownload: "N",

    batchRunTime: null,
    batchRunSchedule: null,
    batchRunCustomDate: null,
    batchRunCustomTime: null
  }),
  actions: {
 
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
  },
  getters: {
 getGroupData: (state) => {
      
      if (state.who === "Student") {
        return state.students.map(student => student.pen);
      } else if (state.who === "District") {
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
    getBatchRunTime: (state) => state.batchRunTime,
    getLocalDownload: (state) => state.getWhere == "localDownload"?"Y":"N", 
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
          let dateTime = new Date(
            state.batchRunCustomDate + "T" + state.batchRunCustomTime
          );
          return (
            dateTime.getSeconds() +
            " " +
            dateTime.getMinutes() +
            " " +
            dateTime.getHours() +
            " " +
            dateTime.getDate() +
            " " +
            (dateTime.getMonth() + 1) +
            " *"
          );
        } else {
          return null;
        }

    },
    getBatchRequest: (state) => {
      console.log(state.who)
      return {
          pens: state.who === "Student" ? state.students.map(student => student.pen) : [],
          schoolOfRecords: state.who === "School" ? state.schools.map(school => school.mincode) : [],
          districts: state.who === "School Category" ? state.districts.map(district => district.district) : [],
          programs: state.who === "Program" ? state.programs.map(program => program.program) : [],
          psiCodes: state.who === "Psi" ? state.psi.map(postSecondaryInstitution => postSecondaryInstitution.psi) : [],
          credentialTypeCode: state.credential,
          schoolCategoryCodes: state.categoryCode,
          gradDateFrom: state.gradDateFrom,
          gradDateTo: state.gradDateTo,
          validateInputs: false,
          quantity: state.copies,
          localDownload: state.getLocalDownload,
      }
    },   
  }

});
