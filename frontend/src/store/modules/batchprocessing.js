import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";

export const useBatchProcessingStore = defineStore("batchProcessing", {
  namespaced: true,
  state: () => ({
    scheduledBatchJobs: [],
    batchRuns: [],
    batchRoutines: [],
    activeTab: "batchRuns",
    
    //delete below
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
    localDownload: "N",
    

    //legacy
    batchDetails: [],
    scheduledBatchJobs: [],
    batchAutoIncrement: 1,
    batchTabsLoading: [],
    tabs: [],
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

  //Vue3 Legacy
    async setScheduledBatchJobs(payload) {
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters);
      }
      
    },
    async setBatchRoutines(payload) {
      this.batchRoutines = payload;
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

    async addValueToTypeInBatchId(payload) {
      this.batchDetails[payload['id']][payload['type']].push({})
    },
    async setScheduledBatchJobs(payload) {
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters); 
      }
    },
    async removeScheduledJobs(payload) {
      
      const response = await BatchProcessingService.removeScheduledJobs(payload);
      this.updateDashboards();
      return response;
       
      
    },   
    async addStudentToBatch(payload){
      this.batchDetails[payload].students.push({})
    },
    async addSchoolToBatch(payload){
      this.batchDetails[payload].schools.push({})
    },
    async addDistrictToBatch(payload){
      this.batchDetails[payload].districts.push({})
    },  
    // Mutations
    async setTabLoading(payload){
      this.batchTabsLoading[payload['index']] = payload['value'];
    },
    async addTypeToBatchId(payload){
      this.batchDetails[payload['id']][payload['type']].push({})
    },
    async deleteValueFromTypeInBatchId(payload) {
        
      const { id, type, value, valid } = payload;
      let items = this.batchDetails[id][type];

      for (const item of items) {
        if (item.value === value) {
          const index = items.indexOf(item);
          items.splice(index, 1);
        }
      }
      if(items.length == 0 || !valid){
        items.push({});
      }
    }, 
    async addBatchJob(id){
      console.log(id)
      this.batchAutoIncrement++;
      this.tabs.push(id);
    }, 
    editBatchDetails(payload){
      this.batchDetails[payload['id']]=payload['batchDetail'];
    },
    async clearBatchDetails(payload){
      let date = new Date();
      let psiCurrentYear = String(date.getFullYear());
      if (date.getMonth() + 1 > 8) {
        psiCurrentYear = String(date.getFullYear() + 1);
      }
  
      this.batchDetails[payload]['details'].who="";
      this.batchDetails[payload]['details'].where="BC Mail";
      this.batchDetails[payload]['details'].gradDate="Current Students";
      this.batchDetails[payload]['details'].gradDateFrom="";
      this.batchDetails[payload]['details'].gradDateTo="";
      this.batchDetails[payload]['details'].psiYear=psiCurrentYear;
      this.batchDetails[payload]['details'].psiTransmissionMode="";      
      this.batchDetails[payload]['details'].reportType="";
      this.batchDetails[payload].schools=[{}];
      this.batchDetails[payload].districts=[{}];
      this.batchDetails[payload].programs=[{}];
      this.batchDetails[payload].students=[{}];
      this.batchDetails[payload].psi=[{}];
      this.batchDetails[payload]['details'].blankCertificateDetails=[{}];
      this.batchDetails[payload]['details'].blankTranscriptDetails=[{}];
      this.batchDetails[payload]['details'].credential="";
      this.batchDetails[payload]['details'].categoryCode="";
      this.batchDetails[payload]['details'].copies="1";
      this.batchDetails[payload]['details'].allPsi=false;
      this.batchDetails[payload]['details'].allDistricts=false;
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
    async setScheduledBatchJobs(payload){
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters); 
      }
    }            

  },
  getters: {
    getActiveTab: (state) => {
      return state.activeTab
    },
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

    
   
    //batch getters legacy
    getBatchDetails: (state) => {
      return state.batchDetails;
    },
    getBatchCounter: (state) => {
      return state.batchAutoIncrement;
    },
    getBatchTabsLoading: (state) => {
      return state.batchTabsLoading;
    },
    getBatchProcessingTabs:(state) => {
      return state.tabs;
    },  
    getScheduledBatchJobs: (state) => {
      return state.scheduledBatchJobs;
    },   
    getBatchDetailsTypeById: (state) =>{
      return function(args){
        return state.batchDetails[args].details['what']
        
      }
    },
    getbatchDetailsGroupById: (state) =>{
      return function(args){
        return state.batchDetails[args].details['who']    
      }
    }
  }

});
