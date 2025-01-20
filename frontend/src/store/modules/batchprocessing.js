import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";
import { useSnackbarStore } from "../../store/modules/snackbar";
export const useBatchProcessingStore = defineStore("batchProcessing", {
  namespaced: true,
  state: () => ({
    snackbarStore: useSnackbarStore(),
    scheduledBatchJobs: [],
    batchRuns: [],
    batchRoutines: [],
    activeTab: "batchRuns",
    gettingBatchJobs: false,
    gettingScheduledBatchJobs: false,
    gettingBatchRoutines: false,
    
  }),
  actions: {
    async updateDashboards() {
      this.gettingScheduledBatchJobs = true;
      this.gettingBatchRoutines = true;
      this.gettingBatchJobs = true;
      await this.setBatchJobs();
      const batchRunScheduledRuns =
        await BatchProcessingService.getScheduledBatchJobs();
      this.setScheduledBatchJobs(batchRunScheduledRuns.data);

      const batchRunRoutines =
        await BatchProcessingService.batchProcessingRoutines();
      this.setBatchRoutines(batchRunRoutines.data);
    },
    async setActiveTab(payload) {
      this.activeTab = payload;
    },
    async setBatchRoutines(payload) {
      this.batchRoutines = payload;
      this.gettingBatchRoutines = false;
    },
    async setScheduledBatchJobs(payload) {
      this.scheduledBatchJobs = payload;
      for (let value of this.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters);
      }
      this.gettingScheduledBatchJobs = false;
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
          this.gettingBatchJobs = false;
        })
        .catch((error) => {
          this.gettingBatchJobs = false;
          if (error.response && error.response.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error.response.statusText,
              "error",
              10000,
              "ERROR" + error.response.status
            );
          }
        });
    },
    async removeScheduledJobs(payload) {
      const response = await BatchProcessingService.removeScheduledJobs(
        payload
      );
      this.updateDashboards();
      return response;
    },

    async setJwtToken(token = null) {
      if (token) {
        this.isAuthenticated = true;
        this.jwtToken = token;
        localStorage.setItem("jwtToken", token);
      } else {
        this.isAuthenticated = false;
        this.jwtToken = null;
        localStorage.removeItem("jwtToken");
      }
    },

    // async setScheduledBatchJobs(payload) {
    //   this.scheduledBatchJobs = payload;
    //   for (let value of this.scheduledBatchJobs) {
    //     value.jobParameters = JSON.parse(value.jobParameters);
    //   }
    //   this.gettingScheduledBatchJobs = false;
    // },
    // async setBatchRoutines(payload) {
    //   this.batchRoutines = payload;
    //   this.gettingBatchRoutines = false;
    // },

    async removeScheduledJobs(payload) {
      const response = await BatchProcessingService.removeScheduledJobs(
        payload
      );
      this.updateDashboards();
      return response;
    },
    // async setScheduledBatchJobs(payload) {
    //   this.scheduledBatchJobs = payload;
    //   for (let value of this.scheduledBatchJobs) {
    //     value.jobParameters = JSON.parse(value.jobParameters);
    //   }
    //   this.gettingScheduledBatchJobs = false;
    // },
  },
  getters: {
    getActiveTab: (state) => {
      return state.activeTab;
    },
    getScheduledBatchRuns: (state) => state.scheduledBatchJobs,
    getBatchRuns: (state) => state.batchRuns,
    getBatchRoutines: (state) => state.batchRoutines,
    getIsGettingScheduledBatchJobsLoading: (state) =>
      state.gettingScheduledBatchJobs,
    getIsGettingBatchRoutinesLoading: (state) => state.gettingBatchRoutines,
    getIsGettingBatchJobsLoading: (state) => state.gettingBatchJobs,
  },
});
