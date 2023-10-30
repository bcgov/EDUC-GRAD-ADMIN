import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";

export const useBatchProcessingStore = defineStore("batchProcessing", {
  namespaced: true,
  state: () => ({
    scheduledBatchJobs: [],
    batchRuns: [],
    batchRoutines: [],
    schools: [],
    districts: [],
    programs:[],
    students:[],
    psi:[],
    who:"",
    where:"BC Mail",
    gradDate:"Current Students",
    gradDateFrom:"",
    gradDateTo:"",
    psiYear:"",
    psiTransmissionMode:"",     
    blankCertificateDetails:[{}],
    blankTranscriptDetails:[{}],
    credential:"",
    categoryCode:[],
    copies:"1",
    allPsi:false,
    allDistricts:false,
    localDownload: "N"
  }),
  actions: {
    async updateDashboards(){
      await this.setBatchJobs();
      const batchRunScheduledRuns = await BatchProcessingService.getScheduledBatchJobs()
      this.setScheduledBatchJobs(batchRunScheduledRuns.data);

      const batchRunRoutines = await BatchProcessingService.batchProcessingRoutines()
      this.setBatchRoutines(batchRunRoutines.data);      
    },
 
    async setGroup(payload) {
      this.who = payload;
    },
    async setSchoolCategory(payload) {
      this.categoryCode= [payload];
    },    
    async setBatchRoutines(payload) {
      this.batchRoutines = payload;
    },
    async setScheduledBatchJobs(payload) {
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters);
      }
      
    },
    async setBatchJobs() {
      BatchProcessingService.getDashboardInfo()
      .then((response) => {
        let batchRunData = response.data.batchInfoList;
        //parameters
        for (const batch of batchRunData) {
          batch.jobParameters = JSON.parse(batch.jobParameters);
        }
    
        // Set the batchRuns property
        this.batchRuns = batchRunData;
        
      })
      .catch((error) => {
        this.adminDashboardLoading = false;
        if (error.response && error.response.status) {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        }
      });
    },
    async removeScheduledJobs( payload) {
        const response = await BatchProcessingService.removeScheduledJobs(payload);
        this.updateDashboards();
        return response;
    },
    async setStudents (payload){
      this.students = payload
    },
    async setSchools (payload){
      this.schools = payload
    },
    async setDistricts (payload){
      this.districts = payload
    },
    async setPsi (payload){
      this.psi = payload
    },
    async setPrograms (payload){
      this.programs = payload
    },  
    async setGradDateTo(payload){
      this.gradDateTo = payload
    },
    async setGradDateFrom(payload){
      this.gradDateFrom = payload
    },
    async setCredential(payload){
      this.credential = payload
    }, 
    async setWhere(payload){
      this.where = payload
    },                        
    async clearBatchGroupData(){
      this.schools=[];
      this.districts=[];
      this.programs=[];
      this.students=[];
      this.psi=[];
    }, 
    async setJwtToken(token = null){
      if (token) {
        this.isAuthenticated = true;
        this.jwtToken = token;
        localStorage.setItem('jwtToken', token);
      } else {
        this.isAuthenticated = false;
        this.jwtToken = null;
        localStorage.removeItem('jwtToken');
      }
    },
  
    async clearBatch(){
      let date = new Date();
      let psiCurrentYear = String(date.getFullYear());
      if (date.getMonth() + 1 > 8) {
        psiCurrentYear = String(date.getFullYear() + 1);
      }
      this.schools=[];
      this.districts=[];
      this.programs=[];
      this.students=[];
      this.psi=[];
      this.who="";
      this.where="BC Mail";
      this.gradDate="Current Students";
      this.gradDateFrom="";
      this.gradDateTo="";
      this.psiYear=psiCurrentYear;
      this.psiTransmissionMode="";      
      
      this.blankCertificateDetails=[{}];
      this.blankTranscriptDetails=[{}];
      this.credential="";
      this.categoryCode=[];
      this.copies="1";
      this.allPsi=false;
      this.allDistricts=false;
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
    // New getter to check if groupData is empty
    getGroupDataIsEmpty: (state, getters) => {
      const groupData = getters.getGroupData;
      return groupData.length === 1;
    },
    getScheduledBatchRuns: (state) => state.scheduledBatchJobs,
    getGroup: (state) => state.who,
    getWhere: (state) => state.where,
    getBatchRuns: (state) => state.batchRuns,
    getBatchRoutines: (state) => state.batchRoutines,
    getStudents: (state) => state.students,
    getSchools: (state) => state.schools,
    getDistricts: (state) => state.districts,
    getPrograms: (state) => state.programs,
    getCredential: (state) => state.credential,
    getPsi: (state) => state.psi,
    getLocalDownload: (state) => state.getWhere == "localDownload"?"Y":"N", 
    getBatchRequest: (state) => {
      return {
          pens: state.who === "Student" ? state.students.map(student => student.pen) : [],
          schoolOfRecords: state.who === "School" ? state.schools.map(school => school.mincode) : [],
          districts: state.who === "District" ? state.districts.map(district => district.district) : [],
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
    }    
  },
});
