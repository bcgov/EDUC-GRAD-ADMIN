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
    async setActiveTab(payload){
      this.activeTab=payload
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

    async setScheduledBatchJobs(payload) {
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters);
      }
    },
    async setBatchRoutines(payload) {
      this.batchRoutines = payload;
    },

    async removeScheduledJobs(payload) {
      const response = await BatchProcessingService.removeScheduledJobs(payload);
      this.updateDashboards();
      return response;
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
    getScheduledBatchRuns: (state) => state.scheduledBatchJobs,
    getBatchRuns: (state) => state.batchRuns,
    getBatchRoutines: (state) => state.batchRoutines,

  }
   

});
