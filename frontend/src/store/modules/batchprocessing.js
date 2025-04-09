import { defineStore } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";
import { useSnackbarStore } from "../../store/modules/snackbar";
export const useBatchProcessingStore = defineStore("batchProcessing", {
  namespaced: true,
  state: () => ({
    snackbarStore: useSnackbarStore(),
    scheduledBatchJobs: [],
    batchRuns: {
      data: [],
      totalElements: null,
      params: {},
      currentPage: 1,
      itemsPerPage: 10,
      loading: false,
    },
    batchRoutines: [],
    activeTab: "batchRuns",
    gettingScheduledBatchJobs: false,
    gettingBatchRoutines: false,
    //delete below
    schools: [],
    districts: [],
    programs: [],
    students: [],
    psi: [],
    who: "",
    where: "BC Mail",
    gradDate: "Current Students",
    gradDateFrom: "",
    gradDateTo: "",
    psiYear: "",
    psiTransmissionMode: "",
    blankCertificateDetails: [{}],
    blankTranscriptDetails: [{}],
    credential: "",
    categoryCode: [],
    copies: "1",
    allPsi: false,
    allDistricts: false,
    localDownload: "N",

    //legacy
    batchDetails: [],
    scheduledBatchJobs: [],
    batchAutoIncrement: 1,
    batchTabsLoading: [],
    tabs: [],
  }),
  actions: {
    async updateDashboards() {
      this.gettingScheduledBatchJobs = true;
      this.gettingBatchRoutines = true;
      this.batchRuns.loading = true;

      //set batch runs table back to first page
      this.batchRuns.currentPage = 1;
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
      this.batchRuns.loading = true;
      let params = {
        pageNumber: this.batchRuns.currentPage - 1,
        pageSize: this.batchRuns.itemsPerPage,
        sort: {
          createDate: "DEC",
        },
      };

      BatchProcessingService.getDashboardInfo(params)
        .then((response) => {
          let batchRunData = response.data.content;

          // parse jobParameters into valid JSON
          for (const batch of batchRunData) {
            batch.jobParameters = JSON.parse(batch.jobParameters);
          }
          // set batchRuns and totalElements
          this.batchRuns.data = batchRunData;
          this.batchRuns.totalElements = response.data.totalElements;
        })
        .catch((error) => {
          if (error.response && error.response.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error.response.statusText,
              "error",
              10000,
              "ERROR" + error.response.status
            );
          }
        })
        .finally(() => {
          // always set loading to false when call completes
          this.batchRuns.loading = false;
        });
    },
    setBatchJobsCurrentPage(page) {
      this.batchRuns.currentPage = page;
    },
    setBatchJobsItemsPerPage(itemsPerPage) {
      this.batchRuns.itemsPerPage = itemsPerPage;
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
    // scheduled batch jobs getters
    getScheduledBatchRuns: (state) => state.scheduledBatchJobs,
    getIsGettingScheduledBatchJobsLoading: (state) =>
      state.gettingScheduledBatchJobs,
    // batch runs getters
    getBatchRuns: (state) => state.batchRuns.data,
    getBatchRunsTotalElements: (state) => state.batchRuns.totalElements,
    getBatchRunsItemsPerPage: (state) => state.batchRuns.itemsPerPage,
    getBatchRunsCurrentPage: (state) => state.batchRuns.currentPage,
    getIsGettingBatchJobsLoading: (state) => state.batchRuns.loading,
    // batch routines getters
    getBatchRoutines: (state) => state.batchRoutines,
    getIsGettingBatchRoutinesLoading: (state) => state.gettingBatchRoutines,
  },
});
